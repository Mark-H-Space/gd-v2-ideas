from pathlib import Path
import re,json,subprocess
exec(Path('scripts/build-version-b.py').read_text().split('root=Path')[0])
config=json.loads(Path('version-b-mega-menu.json').read_text())
def strip(s):
 t=Parser(s);edits=[]
 for n in t.nodes:
  if n.has('nav-item') or n.has('mobile-drawer-group'):
   a=re.search(r'<a[^>]*class="nav-link"[^>]*>(.*?)</a>',t.raw(n),re.S)
   if a and text(a[1]) in config:edits.append((n.start,n.end,'MENU:'+text(a[1])))
 for start,end,v in sorted(edits,reverse=True):s=s[:start]+v+s[end:]
 s=re.sub(r'<link rel="stylesheet" href="version-b-menus.css[^>]+>','',s)
 s=re.sub(r'<script src="version-b-mega-routes.js[^>]+></script>','',s)
 return re.sub(r'(catalogue-context.js|version-b-mirrors.js)\?v=[^"]+',r'\1?v=normalised',s)
for p in Path('dist').glob('*.html'):
 old=subprocess.check_output(['git','show','HEAD:'+str(p)],text=True)
 assert strip(old)==strip(p.read_text()),'Change outside authorised menus: '+str(p)
 s=p.read_text();t=Parser(s)
 for dept,c in config.items():
  menus=[n for n in t.nodes if n.has('department-mega') and n.attrs.get('data-department')==dept]
  if 'class="nav-item"' not in s:continue
  assert len(menus)==1,(p,dept)
  cols=[n for n in t.nodes if n.has('mega-col') and menus[0].start<n.start<n.end<menus[0].end];assert len(cols)==4
  for col,group in zip(cols,c['groups']):
   labels=[text(x) for x in re.findall(r'<li><a[^>]*>(.*?)</a></li>',t.raw(col),re.S)]
   assert labels==[label for label,href in group[1:]],(p,dept,labels)
  feature=[n for n in t.nodes if n.has('department-feature') and menus[0].start<n.start<n.end<menus[0].end];assert len(feature)==1
  assert Path('dist/'+c['image']).is_file()
for p in Path('dist').glob('*filters*'):
 try:old=subprocess.check_output(['git','show','HEAD:'+str(p)])
 except subprocess.CalledProcessError:continue
 assert old==p.read_bytes(),'Filter changed: '+str(p)
for name in ['gallery-theme.css','gallery-page-theme.css','preview.css','preview.js','catalogue-data.js','mirror-data.js']:
 assert subprocess.check_output(['git','show','HEAD:dist/'+name])==Path('dist/'+name).read_bytes(),name
print('Passed: exact requested lists, four content columns plus image panel, unchanged other menus and page markup, untouched filters/product records/shared styling.')
