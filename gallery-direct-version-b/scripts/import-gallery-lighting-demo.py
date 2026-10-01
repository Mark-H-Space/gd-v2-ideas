"""20 supplied lighting image sets with explicitly fictional preview data."""
from pathlib import Path
from zipfile import ZipFile
from PIL import Image,ImageOps
import io,json,re,sys
root=Path(__file__).resolve().parents[1]
# Names and all commercial/technical attributes below are demonstration values.
entries=[
('976638','Halo Ring Pendant','Pendants','Gold','Metal',350,430,350),
('976171','Orbit Twin Ring Pendant','Pendants','Brass','Metal',650,380,650),
('975594','Lattice Globe Pendant','Pendants','Black','Metal',400,450,400),
('910410','Glass Lantern Pendant','Pendants','Clear','Glass',280,420,280),
('981823','Globe Cluster Floor Lamp','Floor Lamps','Brass','Metal',380,1600,380),
('190669','Classic Drum Floor Lamp','Floor Lamps','Beige','Metal',420,1550,420),
('154791','Halo Floor Lamp','Floor Lamps','Gold','Metal',300,1450,300),
('981786','Ribbed Glass Ceiling Light','Ceiling Lights','Brass','Glass',550,300,550),
('157600','Triple Spotlight Ceiling Light','Spot Lights','Gold','Metal',600,220,150),
('152070','Opal Flush Ceiling Light','Ceiling Lights','Cream','Glass',280,250,280),
('916474','Smoked Globe Bulb','Bulbs','Grey','Glass',125,175,125),
('893814','Glitter Globe Table Lamp','Table Lamps','Gold','Glass',250,280,250),
('027125','Sculptural Orbit Table Lamp','Table Lamps','Silver','Metal',300,420,250),
('010295','Square Shade Table Lamp','Table Lamps','Grey','Metal',300,520,180),
('996544','Emerald Drum Table Lamp','Table Lamps','Green','Metal',350,600,350),
('996438','Angled Desk Lamp','Desk Lamps','Brass','Metal',200,450,300),
('028429','Ivory Shade Wall Light','Wall Lights','Cream','Metal',160,350,220),
('027446','Twin Glass Wall Light','Wall Lights','Silver','Glass',350,250,200),
('027040','Adjustable Reading Wall Light','Wall Lights','Silver','Metal',140,220,180),
('893720','Textured Drum Shade','Lamp Shades','Brown','Fabric',400,250,400)]
out=root/'dist/assets/gallery-lighting';out.mkdir(parents=True,exist_ok=True)
products=[];manifest=[]
with ZipFile(sys.argv[1]) as z:
 for i,(key,name,type_,colour,material,w,h,d) in enumerate(entries):
  frames=[]
  for n in z.namelist():
   if '__MACOSX' in n:continue
   m=re.search(r'(\d{6})(?:~(\d+))?\.(?:jpe?g|png)$',n,re.I)
   if m and m[1]==key:frames.append((int(m[2] or 0),n))
  frames.sort();assert frames and frames[0][0]==0
  urls=[]
  for variant,n in frames:
   with Image.open(io.BytesIO(z.read(n))) as pic:
    pic=ImageOps.exif_transpose(pic).convert('RGB');pic.thumbnail((1800,1800),Image.Resampling.LANCZOS)
    buf=io.BytesIO();pic.save(buf,'WEBP',quality=88,method=4);payload=buf.getvalue();assert payload
    filename=key+(f'~{variant}' if variant else '')+'.webp';dest=out/filename;dest.write_bytes(payload)
   with Image.open(dest) as test:test.load()
   urls.append('assets/gallery-lighting/'+filename);manifest.append({'imageKey':key,'source':n,'asset':urls[-1]})
  availability=['In stock','Due Soon / Incoming','Pre-order'][i%3]
  dimensions=f'{w} × {h} × {d} mm'
  p={'sku':'GD-DEMO-LIGHT-'+key,'imageKey':key,'name':name,'dept':'Lighting','type':type_,'colour':colour,'material':material,'width_mm':w,'height_mm':h,'depth_mm':d,'dimensions':dimensions,'size':'Medium','style':'Contemporary','finish':'Brushed' if material=='Metal' else 'Textured' if material=='Fabric' else 'Gloss','availability':availability,'stock':availability,'brand':'Gallery Direct demo','collection':'Lighting Preview','range':'Lighting Preview','rrp':None,'image':urls[0],'images':urls,'imageLabel':name+' — supplied Gallery lighting photograph','sampleOrder':i,'isCatalogue':True,'demoLighting':True,'indoorOutdoor':'Indoor','description':'Demo product data for this prototype. The Gallery image is supplied; the product name, dimensions, materials, technical specifications and availability are illustrative and must be replaced with verified catalogue data before ordering.','specifications':[['Data status','Demo values — unverified'],['Image reference',key],['Product type (demo)',type_],['Dimensions (demo)',dimensions],['Colour (demo)',colour],['Material (demo)',material],['Availability (demo)',availability]]}
  if type_ not in ['Bulbs','Lamp Shades']:
   p.update(room='Office' if type_=='Desk Lamps' else 'Living Room',dimmable='No',ipRating='IP20',numberOfLights=2 if key=='027446' else 3 if key in ['981823','981786','157600'] else 1,bulbType='E27',bulbIncluded='No',maxWattage=40)
   if type_ in ['Desk Lamps','Wall Lights','Floor Lamps']:p['adjustable']='Yes' if key in ['996438','027040'] else 'No'
  if key in ['976638','976171','154791','027125']:
   p.update(integratedLed=True,lightSource='Integrated LED',maxWattage=18);p.pop('bulbType',None);p.pop('bulbIncluded',None)
  if type_=='Bulbs':p.update(bulbType='E27',maxWattage=6)
  if key in ['190669','010295','996544','028429','893720']:p.update(hasShade=True,shadeMaterial='Fabric')
  products.append(p)
p=root/'dist/catalogue-data.js';data=json.loads(p.read_text().split('=',1)[1].strip().rstrip(';'))
data['products']=[p for p in data['products'] if p['dept']!='Lighting']+products
p.write_text('window.GALLERY_CATALOGUE='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
(root/'checks/gallery-lighting-demo-report.json').write_text(json.dumps({'productCount':20,'imageCount':len(manifest),'productsWithAlternates':sum(len(p['images'])>1 for p in products),'dataStatus':'Fictional demo data; supplied Gallery images','assets':manifest},indent=2))
print(len(products),'products;',len(manifest),'images;',sum(len(p['images'])>1 for p in products),'with alternates')
