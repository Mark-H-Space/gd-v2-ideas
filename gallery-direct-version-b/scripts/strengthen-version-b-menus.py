from pathlib import Path
from urllib.parse import urlencode
import html,json,re
# Reuse only the parser definitions; the earlier duplication script is not run.
exec(Path(__file__).with_name('build-version-b.py').read_text().split('root=Path')[0])
root=Path(__file__).resolve().parents[1]
def route(dept,kind=None,value='',label=''):
 path='mirrors.html' if dept=='Mirrors' else 'catalogue.html'
 params={} if dept=='Mirrors' else {'dept':dept}
 if kind:params.update(nav=kind,value=value,label=label or value)
 return path+('?' + urlencode(params) if params else '')
def link(dept,label,kind=None,value=None):return [label,route(dept,kind,value if value is not None else label,label)]
def inspire(dept):return ['Inspiration','inspiration.html?'+urlencode({'dept':dept})]
config={
'Art':{'groups':[
 ['Shop Art',link('Art','All Art'),*[link('Art',s,'product') for s in ['Framed Art','Canvas Art','Glass Art','Art Sets','Metal Wall Art']]],
 ['Subject',*[link('Art',s,'subject') for s in ['Abstract','Landscape','Coastal','Floral & Botanical','Animals','People','Typography']]],
 ['Style',*[link('Art',s,'style') for s in ['Modern','Heritage','Country','Chic','Contemporary']]],
 ['Discover',link('Art','New Art','new'),link('Art','Large Art','large'),link('Art','Art Sets','product'),inspire('Art')]],'image':'assets/gallery-art/057404~1.webp','alt':'Gallery framed artworks above a sofa','caption':'Art in the home','featureHref':'product.html?sku=057404&dept=Art'},
'Mirrors':{'groups':[
 ['Shop Mirrors',link('Mirrors','All Mirrors'),*[link('Mirrors',label,'type',value) for label,value in [('Wall Mirrors','Wall Mirror'),('Leaner Mirrors','Leaner Mirror'),('Freestanding Mirrors','Freestanding'),('Overmantel Mirrors','Overmantel'),('Cheval Mirrors','Cheval'),('Tabletop Mirrors','Tabletop')]]],
 ['Shop by Shape',*[link('Mirrors',s,'shape') for s in ['Round','Oval','Rectangle','Arched','Rounded Rectangle','Freeform']]],
 ['Style / Room',*[link('Mirrors',s,'style') for s in ['Modern','Heritage','Country','Chic']],*[link('Mirrors',s,'room') for s in ['Living Room','Hallway','Bedroom','Cloakroom','Outdoor']]],
 ['Discover',link('Mirrors','New Mirrors','new'),link('Mirrors','Large Mirrors','large'),link('Mirrors','Statement Mirrors','statement'),inspire('Mirrors')]],'image':'assets/gallery-mirrors/567929~1.webp','alt':'Gallery Windsor round mirror in a room setting','caption':'Make a statement','featureHref':'product.html?sku=567929'},
'Clocks':{'groups':[
 ['Shop Clocks',link('Clocks','All Clocks'),link('Clocks','Large Wall Clocks','wallSize','Large'),link('Clocks','Small Wall Clocks','wallSize','Small'),*[link('Clocks',s,'type') for s in ['Cuckoo Clocks','Outdoor Clocks','Mantel Clocks']]],
 ['Shop by Type',*[link('Clocks',s,'type') for s in ['Wall Clocks','Mantel Clocks','Cuckoo Clocks','Outdoor Clocks']],*[link('Clocks',s,'face') for s in ['Open Face','Glazed','Skeleton']]],
 ['Style / Dial',*[link('Clocks',s,'style') for s in ['Modern','Classic','Country']],*[link('Clocks',s,'dial') for s in ['Arabic Numerals','Roman Numerals','Batons / Markers']]],
 ['Discover',link('Clocks','Thomas Kent Clocks','brand','Thomas Kent'),link('Clocks','New Clocks','new'),link('Clocks','Oversized Clocks','type'),inspire('Clocks')]],'image':'images/clocks-category.png','alt':'Existing Thomas Kent clock room scene','caption':'Thomas Kent','featureHref':route('Clocks','brand','Thomas Kent','Thomas Kent Clocks')}
}
def esc(v):return html.escape(v,quote=True)
def columns(dept,c):
 return ''.join('<div class="mega-col"><a class="mega-title" href="'+esc(route(dept))+'"><span>'+esc(title)+'</span><span class="direction-arrow" aria-hidden="true"><i></i></span></a><ul>'+''.join('<li><a href="'+esc(href)+'">'+esc(label)+'</a></li>' for label,href in links)+'</ul></div>' for title,*links in c['groups'])
def desktop(dept,c):
 return '<div class="nav-item"><div class="nav-link-wrap"><a href="'+esc(route(dept))+'" class="nav-link">'+dept+'</a></div><div class="mega-menu department-mega" data-department="'+dept+'"><div class="mega-inner"><div class="mega-grid editorial-grid" data-columns="4">'+columns(dept,c)+'<a class="department-feature" href="'+esc(c['featureHref'])+'"><img src="'+c['image']+'" alt="'+esc(c['alt'])+'" loading="lazy" width="320" height="350"><span>'+esc(c['caption'])+'<span class="direction-arrow" aria-hidden="true"><i></i></span></span></a></div></div></div></div>'
def mobile(dept,c):
 return '<div class="mobile-drawer-group"><a href="'+esc(route(dept))+'" class="nav-link">'+dept+'</a>'+''.join('<details class="mobile-nav-section"><summary>'+esc(title)+'</summary><div class="mobile-nav-links">'+''.join('<a href="'+esc(href)+'">'+esc(label)+'</a>' for label,href in links)+'</div></details>' for title,*links in c['groups'])+'</div>'
for p in (root/'dist').glob('*.html'):
 s=p.read_text();t=Parser(s);edits=[]
 for n in t.nodes:
  if not(n.has('nav-item') or n.has('mobile-drawer-group')):continue
  raw=t.raw(n);a=re.search(r'<a[^>]*class="nav-link"[^>]*>(.*?)</a>',raw,re.S)
  if a and text(a[1]) in config:
   dept=text(a[1]);edits.append((n.start,n.end,desktop(dept,config[dept]) if n.has('nav-item') else mobile(dept,config[dept])))
 for start,end,new in sorted(edits,reverse=True):s=s[:start]+new+s[end:]
 if edits:
  s=s.replace('</head>','<link rel="stylesheet" href="version-b-menus.css?v=20261001-editorial"></head>')
 if p.name in ['catalogue.html','mirrors.html']:
  target='catalogue-context.js' if p.name=='catalogue.html' else 'version-b-mirrors.js'
  s=s.replace('<script src="'+target,'<script src="version-b-mega-routes.js?v=20261001-editorial" defer></script><script src="'+target)
  s=re.sub(target+r'\?v=[^"]+',target+'?v=20261001-editorial',s)
 p.write_text(s)
(root/'version-b-mega-menu.json').write_text(json.dumps(config,indent=2)+'\n')
p=root/'navigation-taxonomy.json';tree=json.loads(p.read_text())
for menu in tree:
 if menu['title'] in config:
  menu['groups']=[{'title':title,'href':route(menu['title']),'links':links} for title,*links in config[menu['title']]['groups']]
p.write_text(json.dumps(tree,indent=2)+'\n')
