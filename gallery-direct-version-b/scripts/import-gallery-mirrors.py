"""Build the approved 20-product mirror POC from the cleaned workbook extraction.
Usage: python scripts/import-gallery-mirrors.py SOURCE_DIRECTORY MIRROR_ZIP
The workbook/archive remain outside the public site; only allowlisted fields ship.
"""
from pathlib import Path
from zipfile import ZipFile
from collections import Counter
from PIL import Image, ImageOps
import io,json,re,sys
source=Path(sys.argv[1]); archive=Path(sys.argv[2]); root=Path(__file__).resolve().parents[1]
rows=json.loads((source/'master.json').read_text()); index=json.loads((source/'archive-index.json').read_text())
keys=['567929','082904','082911','082928','256677','256684','256653','468821','468814','407376','438114','469033','228572','428764','256639','407383','403181','082959','252010','433249']
assert len(keys)==len(set(keys))==20
assert all(n==1 for n in Counter(r['ImageKey'] for r in rows).values())
by_key={r['ImageKey']:r for r in rows};out=root/'dist/assets/gallery-mirrors';out.mkdir(parents=True,exist_ok=True)
products=[]; manifest=[];issues=[]
with ZipFile(archive) as z:
 for key in keys:
  r=by_key[key]; assert r['Barcode'].endswith(key)
  images=sorted(index['sets'].get(key,[]),key=lambda i:i['variant'])
  if key=='567929' and not images:
   images=[{'path':str(p),'variant':int(re.search(r'~(\d+)',p.name)[1]) if '~' in p.name else 0,'local':True} for p in (source/'images').glob('*567929*.jpg')]
   images.sort(key=lambda i:i['variant'])
  assert images and images[0]['variant']==0,key
  urls=[]
  for im in images:
   raw=Path(im['path']).read_bytes() if im.get('local') else z.read(im['path'])
   with Image.open(io.BytesIO(raw)) as pic:
    pic=ImageOps.exif_transpose(pic).convert('RGB'); original=pic.size;pic.thumbnail((1800,1800),Image.Resampling.LANCZOS)
    filename=key+('~'+str(im['variant']) if im['variant'] else '')+'.webp'; dest=out/filename;encoded=io.BytesIO();pic.save(encoded,'WEBP',quality=88,method=6);payload=encoded.getvalue();assert payload;dest.write_bytes(payload);assert dest.stat().st_size==len(payload)
    assert abs(pic.width/pic.height-original[0]/original[1])<0.01
   url='assets/gallery-mirrors/'+filename;urls.append(url)
   manifest.append({'imageKey':key,'sourceFilename':Path(im['path']).name,'asset':url,'primary':im['variant']==0,'originalDimensions':original})
  name=r['ProductName']; low=name.lower()
  shape=r.get('Shape') or next((label for pattern,label in [(r'\bround\b','Round'),(r'\brectangle\b','Rectangular'),(r'\barch\b','Arched'),(r'\boctagon\b','Octagonal'),(r'\boval\b','Oval')] if re.search(pattern,low)),'')
  colour=r.get('Colour') or next((c for c in ['Black','White','Cream','Beige','Brown','Grey','Green','Blue','Pink','Red','Orange','Yellow','Gold','Silver','Bronze','Champagne','Natural'] if re.search(r'\b'+c.lower()+r'\b',low)),'')
  w=float(r['Width_mm']) if r.get('Width_mm') else None; h=float(r['Height_mm']) if r.get('Height_mm') else None; depth=float(r['Depth_mm']) if r.get('Depth_mm') else None
  dimension_match=re.search(r'(\d+(?:\.\d+)?(?:\s*[xX×]\s*\d+(?:\.\d+)?){0,2})\s*mm\b',name)
  dims=[float(v) for v in re.findall(r'\d+(?:\.\d+)?',dimension_match[1])] if dimension_match else []
  dimensions=' × '.join(f'{v:g}' for v in dims)+' mm' if dims else ''
  # Equal two-axis measurements and a round diameter are unambiguous.
  if len(dims)==1 and shape=='Round':w=w or dims[0];h=h or dims[0]
  elif len(dims)==2 and dims[0]==dims[1]:w=w or dims[0];h=h or dims[1]
  elif len(dims)>1:issues.append({'imageKey':key,'issue':'Dimensions retained from name; axis order unconfirmed, width/height not inferred.'})
  if not dimensions and w and h:dimensions=f'{w:g} × {h:g} mm'
  category=[];ptype=r.get('ProductType') or ''
  if 'leaner' in low:category=['Leaner Mirrors'];ptype='Leaner & floor'
  elif re.search(r'overmant(?:le|el)',low):category=['Over Mantel Mirrors'];ptype='Overmantle'
  elif re.search(r'\bwall\b',low):category=['Wall Mirrors'];ptype='Wall mirrors'
  # No wall-mounting, orientation, material or style inference from appearance.
  longest=max(dims) if len(dims)<=2 and dims else max([v for v in [w,h] if v] or [0]);size=('Small' if longest<=600 else 'Medium' if longest<=900 else 'Large' if longest<=1200 else 'Extra large') if longest else ''
  availability=r.get('Availability',''); availability={'In Stock':'In stock'}.get(availability,availability)
  spec=[['Barcode',r['Barcode']],['ImageKey',key],['Brand',r.get('Brand','')],['Range',r.get('Range','')],['Product type',ptype]]
  if dimensions:spec.append(['Dimensions supplied in product name',dimensions])
  for label,val in [('Item width',w),('Item height',h),('Item depth',depth)]:
   if val:spec.append([label,f'{val:g} mm'])
  for label,val in [('Shape',shape),('Colour',colour),('Orientation',r.get('Orientation','')),('Style',r.get('Style','')),('Availability',availability)]:
   if val:spec.append([label,val])
  p={'sku':key,'imageKey':key,'barcode':r['Barcode'],'name':name,'dept':'Mirrors','brand':r.get('Brand',''),'range':r.get('Range',''),'collection':r.get('Range',''),'type':ptype,'mirrorCategory':category,'shape':shape,'colour':colour,'width':w,'height':h,'depth':depth,'width_mm':w,'height_mm':h,'orientation':r.get('Orientation',''),'style':r.get('Style',''),'size':size,'dimensions':dimensions,'summary':' · '.join(v for v in [dimensions,colour] if v),'description':name,'availability':availability,'rrp':float(r['RRP']) if r.get('RRP') else None,'image':urls[0],'images':urls,'imageLabel':name,'sampleOrder':len(products),'realGalleryMirror':True,'specifications':spec}
  products.append(p)
(root/'dist/mirror-data.js').write_text('window.MIRROR_PRODUCTS = '+json.dumps(products,ensure_ascii=False,separators=(',',':'))+';\n')
report={'matchedProductCount':len(products),'primaryImageProductCount':sum(bool(p['image']) for p in products),'alternateImageProductCount':sum(len(p['images'])>1 for p in products),'importedImageCount':len(manifest),'workbookMirrorCount':len(rows),'archiveImageKeyCount':len(index['sets']),'archiveMatchedKeyCount':len(set(index['sets'])&set(by_key)),'archiveUnmatchedImageKeys':index['unmatched'],'workbookKeysWithoutArchiveImages':sorted(set(by_key)-set(index['sets'])),'sampleImageKeys':keys,'issues':issues,'assets':manifest}
(root/'checks/gallery-mirror-import-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps({k:v for k,v in report.items() if k.endswith('Count')},indent=2))
