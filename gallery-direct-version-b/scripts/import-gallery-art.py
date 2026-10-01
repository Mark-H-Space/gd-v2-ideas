"""Import the approved Art POC; never ship raw workbook/commercial fields."""
from pathlib import Path
from zipfile import ZipFile
from PIL import Image, ImageOps
import io,json,re,sys
source=Path(sys.argv[1]);archive=Path(sys.argv[2]);root=Path(__file__).resolve().parents[1]
rows=json.loads((source/'master.json').read_text());index=json.loads((source/'archive-index.json').read_text());by_key={r['ImageKey']:r for r in rows};assert len(by_key)==len(rows)
keys=['057404','054120','048495','048402','048747','054526','054328','058234','054571','042844','059811','060480','054625','048723','054021','048280','054175','059606','041922','059682']
assert len(keys)==len(set(keys))==20
out=root/'dist/assets/gallery-art';out.mkdir(parents=True,exist_ok=True);products=[];assets=[]
with ZipFile(archive) as z:
 for key in keys:
  r=by_key[key];assert r['Barcode'].endswith(key)
  imgs=sorted(index['sets'][key],key=lambda i:i['variant']);assert imgs[0]['variant']==0
  urls=[]
  for im in imgs:
   with Image.open(io.BytesIO(z.read(im['path']))) as pic:
    pic=ImageOps.exif_transpose(pic).convert('RGB');original=pic.size;pic.thumbnail((1800,1800),Image.Resampling.LANCZOS)
    filename=key+('~'+str(im['variant']) if im['variant'] else '')+'.webp';dest=out/filename;encoded=io.BytesIO();pic.save(encoded,'WEBP',quality=88,method=4);payload=encoded.getvalue();assert len(payload)>0;dest.write_bytes(payload);assert dest.stat().st_size==len(payload)
    assert abs(pic.width/pic.height-original[0]/original[1])<0.01
   url='assets/gallery-art/'+filename;urls.append(url);assets.append({'imageKey':key,'sourceFilename':Path(im['path']).name,'asset':url,'primary':im['variant']==0,'originalDimensions':original})
  name=r['ProductName'];low=name.lower();source_type=r.get('ProductType','')
  art_type={'Framed Canvas':'Canvas','Framed Art':'Framed Art','Canvas':'Canvas','Metal Wall Art':'Metal Wall Art','Print Set':'Print Sets'}.get(source_type,'')
  type_={'Canvas':'Canvas Art','Print Sets':'Art Sets'}.get(art_type,art_type or source_type)
  framed='framed' in low;medium='Canvas' if 'canvas' in low else 'Metal' if source_type=='Metal Wall Art' else ''
  count_match=re.search(r'\b(?:s/|set\s+of\s+)(\d+)\b',low);pieces=int(count_match[1]) if count_match else None
  subject=next((label for pattern,label in [(r'\b(?:chimp|monkey|animals?)\b','Animals'),(r'\b(?:trees?|birch|woods|daisy)\b','Botanical'),(r'\b(?:bay|marina|headland|coastal)\b','Coastal'),(r'\babstract\b','Abstract')] if re.search(pattern,low)),'')
  dm=re.search(r'(\d+(?:\.\d+)?(?:\s*[xX×]\s*\d+(?:\.\d+)?){0,2})\s*mm\b',name);dims=[float(n) for n in re.findall(r'\d+(?:\.\d+)?',dm[1])] if dm else []
  dimensions=' × '.join(f'{n:g}' for n in dims)+' mm' if dims else ''
  w=float(r['Width_mm']) if r.get('Width_mm') else None;h=float(r['Height_mm']) if r.get('Height_mm') else None
  if len(dims)==2 and dims[0]==dims[1]:w=w or dims[0];h=h or dims[1]
  # Three-number strings are retained verbatim; axes remain unconfirmed.
  orientation=r.get('Orientation','');colour=r.get('Colour','');style=r.get('Style','')
  spec=[['Barcode',r['Barcode']],['ImageKey',key],['Brand',r.get('Brand','')],['Range',r.get('Range','')],['Product type',source_type]]
  if dimensions:spec.append(['Dimensions supplied in product name',dimensions])
  for label,v in [('Item width',w),('Item height',h)]:
   if v:spec.append([label,f'{v:g} mm'])
  for label,v in [('Subject',subject),('Medium',medium),('Colour',colour),('Orientation',orientation),('Style',style),('Availability',r.get('Availability',''))]:
   if v:spec.append([label,v])
  if pieces:spec.append(['Number of pieces',str(pieces)])
  products.append({'sku':key,'imageKey':key,'barcode':r['Barcode'],'name':name,'dept':'Art','brand':r.get('Brand',''),'range':r.get('Range',''),'collection':r.get('Range',''),'sourceProductType':source_type,'type':type_,'artType':art_type,'framed':framed,'medium':medium,'subject':subject,'shape':r.get('Shape',''),'colour':colour,'width_mm':w,'height_mm':h,'orientation':orientation,'style':style,'numberOfPieces':pieces,'categoryMembership':['Canvas Art','Art Sets'] if pieces and medium=='Canvas' else [type_],'dimensions':dimensions,'summary':dimensions,'description':name,'availability':r.get('Availability',''),'rrp':float(r['RRP']) if r.get('RRP') else None,'image':urls[0],'images':urls,'imageLabel':name,'sampleOrder':len(products),'isCatalogue':True,'realGalleryArt':True,'specifications':spec})
# Version B displays clean titles; retain measurements in the existing specifications.
for product in products:
 product['name']=re.sub(r'\s*\b\d+(?:\.\d+)?(?:\s*[xX×]\s*\d+(?:\.\d+)?)*\s*mm\b','',product['name']).strip()
p=root/'dist/catalogue-data.js';s=p.read_text();catalogue=json.loads(s.split('=',1)[1].strip().rstrip(';'));original_other=[p for p in catalogue['products'] if p['dept']!='Art'];catalogue['products']=[*original_other,*products]
p.write_text('window.GALLERY_CATALOGUE='+json.dumps(catalogue,ensure_ascii=False,separators=(',',':'))+';\n')
report={'matchedProductCount':20,'primaryImageProductCount':20,'alternateImageProductCount':sum(len(p['images'])>1 for p in products),'importedImageCount':len(assets),'workbookArtCount':len(rows),'archiveImageCount':sum(len(x) for x in index['sets'].values()),'archiveImageKeyCount':len(index['sets']),'archiveMatchedKeyCount':len(set(index['sets'])&set(by_key)),'archiveUnmatchedImageKeys':index['unmatched'],'sampleImageKeys':keys,'assets':assets}
(root/'checks/gallery-art-import-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps({k:v for k,v in report.items() if k.endswith('Count')},indent=2))
