from html.parser import HTMLParser
from pathlib import Path
import re,html
class Node:
 def __init__(self,tag,attrs,start):self.tag=tag;self.attrs=dict(attrs);self.start=start;self.end=start;self.children=[]
 def has(self,c):return c in self.attrs.get('class','').split()
class Parser(HTMLParser):
 def __init__(self,s):
  super().__init__();self.s=s;self.offsets=[0];self.offsets += [m.end() for m in re.finditer('\n',s)];self.root=Node('',[],0);self.stack=[self.root];self.nodes=[];self.feed(s)
 def pos(self):l,c=self.getpos();return self.offsets[l-1]+c
 def handle_starttag(self,t,a):
  n=Node(t,a,self.pos());self.stack[-1].children.append(n);self.nodes.append(n)
  if t not in ['img','input','link','meta','br','hr','source','area','wbr']:self.stack.append(n)
  else:n.end=self.pos()+len(self.get_starttag_text())
 def handle_endtag(self,t):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i].tag==t:
    self.stack[i].end=self.s.index('>',self.pos())+1;self.stack=self.stack[:i];break
 def raw(self,n):return self.s[n.start:n.end]
def text(s):return html.unescape(re.sub('<[^>]+>','',s)).strip()
root=Path(__file__).resolve().parents[1]
for p in (root/'dist').glob('*.html'):
 s=p.read_text();tree=Parser(s);edits=[]
 for node in tree.nodes:
  if node.has('nav-item'):
   raw=tree.raw(node)
   if re.search(r'class="nav-link">Wall Decor</a>',raw):
    cols=[n for n in tree.nodes if n.has('mega-col') and node.start<n.start<n.end<node.end];assert len(cols)==3
    new=''
    for dept,url,col in zip(['Art','Mirrors','Clocks'],['catalogue.html?dept=Art','mirrors.html','catalogue.html?dept=Clocks'],cols):
     new+=f'<div class="nav-item"><div class="nav-link-wrap"><a href="{url}" class="nav-link">{dept}</a></div><div class="mega-menu"><div class="mega-inner"><div class="mega-grid" data-columns="3">{tree.raw(col)}</div><div class="mega-range-link"><a href="{url}">Shop all {dept}</a></div></div></div></div>'
    edits.append((node.start,node.end,new))
  if node.has('mobile-drawer-group'):
   raw=tree.raw(node)
   if re.search(r'class="nav-link">Wall Decor</a>',raw):
    sections=[n for n in tree.nodes if n.has('mobile-nav-section') and node.start<n.start<n.end<node.end];assert len(sections)==3
    new=''.join(f'<div class="mobile-drawer-group"><a href="{url}" class="nav-link">{dept}</a>{tree.raw(section)}</div>' for dept,url,section in zip(['Art','Mirrors','Clocks'],['catalogue.html?dept=Art','mirrors.html','catalogue.html?dept=Clocks'],sections))
    edits.append((node.start,node.end,new))
 for start,end,new in sorted(edits,reverse=True):s=s[:start]+new+s[end:]
 s=re.sub(r'(class="nav-link"[^>]*>)Greeting Cards(</a>)',r'\1Cards\2',s)
 s=s.replace('<a href="decor.html">Wall Decor</a><span>/</span>','')
 if p.name=='mirrors.html':
  s=s.replace('id="category-kicker">Wall Decor','id="category-kicker">Gallery Direct')
  s=s.replace('<script src="preview.js', '<script src="version-b-filters.js?v=1" defer></script><script src="version-b-mirrors.js?v=1" defer></script><script src="preview.js')
  s=s.replace('</head>','<link rel="stylesheet" href="furniture-filters.css?v=20261001-furniture"></head>')
 else:
  s=s.replace('<script src="catalogue-context.js','<script src="version-b-filters.js?v=1" defer></script><script src="catalogue-context.js')
 s=s.replace('preview.js?v=20261001-lighting-demo','preview.js?v=20261001-version-b')
 s=re.sub(r'catalogue-context.js\?v=[^"]+', 'catalogue-context.js?v=20261001-version-b',s)
 p.write_text(s)
p=root/'dist/preview.js';s=p.read_text().replace('const furniture=context?.clocks?', 'const furniture=context?.mirrors?window.MirrorFilters:context?.clocks?')
needle="content=values.length?values.map(v=>";assert needle in s
s=s.replace(needle,"if(context?.hideEmptyValues)values=values.filter(v=>products.some(p=>facetValues(p,k).includes(v)));content=values.length?values.map(v=>")
s=s.replace("const params=new URLSearchParams(location.search);for", "const params=new URLSearchParams(location.search);for")
s=s.replace("if(v)filters[k]=v.split('|')", "if(v)filters[k]=isNumeric(k)?v.split('|'):v.split('|')")
p.write_text(s)
