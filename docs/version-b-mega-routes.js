(() => {
'use strict';
const asArray=v=>Array.isArray(v)?v:v?[v]:[];
const get=(p,...keys)=>keys.map(k=>p[k]).find(v=>v!==undefined&&v!==null&&v!==''&&!['Not supplied','Not specified','To verify'].includes(v));
const equal=(a,b)=>String(a).toLowerCase()===String(b).toLowerCase();
const has=(v,target)=>asArray(v).some(x=>equal(x,target));
const styles={Heritage:['Heritage','Traditional','Classic'],Country:['Country','Rustic']};
const large=p=>['Large','Extra large','Oversized','Grande'].includes(p.size)||Math.max(...[get(p,'width_mm','widthMm'),get(p,'height_mm','heightMm'),get(p,'diameter_mm','diameterMm')].map(Number).filter(Number.isFinite),0)>=900;
const largeArt=p=>large(p)||Math.max(...(String(p.dimensions||'').endsWith('mm')?(String(p.dimensions).match(/\d+(?:\.\d+)?/g)||[]).map(Number):[]),0)>=900;
function match(dept,p,kind,value){
 if(dept==='Greeting Cards'){
  if(kind==='occasion')return window.ArtbeatFilters.values(p,'occasion').includes(value);
  if(kind==='collection')return window.ArtbeatFilters.values(p,'collection').includes(value);
  if(kind==='displays')return ['Display','Displays','Card Display','Card Displays'].includes(get(p,'type','Product Type'));
  if(kind==='best')return p.isBestSeller===true;
  if(kind==='inspiration')return p.inspirationFeatured===true;
 }
 if(kind==='new'){const date=get(p,'launchDate','releaseDate','newFrom');return p.isNew===true||!!(date&&!Number.isNaN(Date.parse(date))&&Date.now()-Date.parse(date)>=0&&Date.now()-Date.parse(date)<=90*864e5);}
 if(kind==='style')return (styles[value]||[value]).some(x=>has(get(p,'style','Style'),x));
 if(kind==='room')return has(get(p,'room','Room'),value)||(value==='Outdoor'&&has(get(p,'indoorOutdoor','Indoor / Outdoor'),'Outdoor'));
 if(kind==='brand')return has(p.brand,value);
 if(dept==='Art'){
  // Curated discovery selections use existing Gallery artworks only.
  if(kind==='showcase')return ['054625','048747','059606','059682','054571'].includes(String(p.imageKey||p.sku));
  if(kind==='wallCollections')return ['060480','057404','048402','058234'].includes(String(p.imageKey||p.sku));
  if(kind==='subject')return window.ArtFilters?.values(p,'subject').some(x=>equal(x,value))|| (value==='Floral & Botanical'?['Floral','Botanical','Floral & Botanical']:['People','People / Figurative'].includes(value)?['People','Figurative','People / Figurative']:[value]).some(x=>has(get(p,'subject','Subject'),x));
  if(kind==='large')return Math.max(window.ArtFilters?.numeric(p,'width')||0,window.ArtFilters?.numeric(p,'height')||0)>=900||largeArt(p);
  if(kind==='product'){
   const type=get(p,'sourceProductType','artType','Art Type','type'),presentation=get(p,'presentation','Presentation');
   if(value==='Art Sets')return Number(get(p,'numberOfPieces','Number of Pieces'))>1||['Art Sets','Print Sets','Print Set'].includes(type);
   if(value==='Framed Art')return ['Framed Art','Framed & Glazed'].includes(type)||presentation==='Framed & Glazed';
   if(value==='Canvas Art')return ['Canvas Art','Canvas','Framed Canvas'].includes(type);
   if(value==='Glass Art')return ['Glass Art','Framed & Glazed'].includes(type)||presentation==='Framed & Glazed'||p.glazed===true;
   return equal(type,value)||equal(presentation,value);
  }
 }
 if(dept==='Mirrors'){
  if(kind==='type'){const target={Freestanding:'Freestanding Mirror',Overmantel:'Overmantel Mirror',Cheval:'Cheval Mirror',Tabletop:'Tabletop Mirror'}[value]||value;return window.MirrorFilters.values(p,'type').includes(target);}
  if(kind==='shape')return window.MirrorFilters.values(p,'shape').includes(value);
  if(kind==='large')return large(p);
  // An editorial selection of existing supplied mirror products, not a new specification.
  if(kind==='statement')return ['567929','468821','468814','469033','252010'].includes(p.imageKey);
 }
 if(dept==='Clocks'){
  if(kind==='type')return value==='Oversized Clocks'?window.ClocksFilters.values(p,'size').includes('Oversized'):window.ClocksFilters.values(p,'type').includes(value);
  if(kind==='oversized')return window.ClocksFilters.values(p,'size').includes('Oversized');
  if(kind==='face')return window.ClocksFilters.values(p,'face').includes(value);
  if(kind==='dial')return window.ClocksFilters.values(p,'dial').includes(value);
  if(kind==='wallSize')return window.ClocksFilters.values(p,'type').includes('Wall Clocks')&&(value==='Large'?['Large','Oversized'].includes(p.size):p.size==='Small');
 }
 return false;
}
function resolve(dept,params,products){const kind=params.get('nav'),value=params.get('value')||'';if(!kind||!['Art','Mirrors','Clocks','Greeting Cards'].includes(dept))return null;return {title:params.get('label')||value||dept,products:products.filter(p=>match(dept,p,kind,value))};}
window.VersionBMegaRoutes={resolve,match};
})();
