(() => {
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const catalogue=(dept,sub='')=>'catalogue.html?'+new URLSearchParams({dept,...(sub?{sub}:{})});
function configure(product,all=[]){
 const dept=product.dept||'Mirrors',display=dept==='Greeting Cards'?'Greetings Cards':dept;
 let title='Explore more '+display.toLowerCase(),tiles=[];
 if(dept==='Mirrors'){
  title='Find the right mirror faster';
  tiles=[['Round','mirrors.html?shape=Round'],['Arched','mirrors.html?shape=Arched'],['Leaner & floor','mirrors.html?type=Leaner+Mirror'],['Overmantel','mirrors.html?type=Overmantel']];
 }else if(dept==='Art'){
  title='Find the right artwork faster';
  tiles=[['All Art',catalogue(dept)],['Framed Art',catalogue(dept,'Framed Art')],['Canvas Art',catalogue(dept,'Canvas Art')],['Art Sets',catalogue(dept,'Art Sets')]];
 }else if(dept==='Clocks'){
  title='Find the right clock faster';
  tiles=['Wall Clocks','Mantel Clocks','Cuckoo Clocks','Oversized Clocks'].map(label=>[label,catalogue(dept,label)]);
 }else if(dept==='Greeting Cards'){
  title='Find the right greeting card faster';
  const occasions=[...new Set(all.filter(p=>p.dept===dept).flatMap(p=>Array.isArray(p.occasion)?p.occasion:p.occasion?[p.occasion]:[]))].filter(v=>!['Not supplied','Not specified','To verify'].includes(v)).slice(0,3);
  tiles=[['All Greetings Cards',catalogue(dept)],...occasions.map(label=>[label,catalogue(dept)+'&'+new URLSearchParams({occasion:label})])];
 }else{
  const types=[...new Set(all.filter(p=>p.dept===dept).map(p=>p.type))].filter(v=>v&&!['Not supplied','Not specified','To verify'].includes(v)).slice(0,3);
  tiles=[['All '+display,catalogue(dept)],...types.map(label=>[label,catalogue(dept,label)])];
 }
 return {title,display,tiles};
}
function render(product,all,block){const config=configure(product,all);block.querySelector('h2').textContent=config.title;block.querySelector('.nav-tiles').innerHTML=config.tiles.map(([label,href])=>`<a href="${esc(href)}"><strong>${esc(label)}</strong><span>Shop ${esc(config.display.toLowerCase())} →</span></a>`).join('');block.hidden=false;}
function init(){const block=document.querySelector('.navigation-band');if(!block||!document.querySelector('#product-title'))return;const all=[...(window.MIRROR_PRODUCTS||[]),...(window.GALLERY_CATALOGUE?.products||[])],sku=new URLSearchParams(location.search).get('sku')||'244855',product=window.CATALOGUE_CONTEXT?.product||all.find(p=>p.sku===sku);if(product)render(product,all,block);else block.hidden=true;}
window.GalleryPdpBrowse={configure,render};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
