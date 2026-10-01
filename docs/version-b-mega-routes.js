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
 if(kind==='new'){const date=get(p,'launchDate','releaseDate','newFrom');return p.isNew===true||!!(date&&!Number.isNaN(Date.parse(date))&&Date.now()-Date.parse(date)>=0&&Date.now()-Date.parse(date)<=90*864e5);}
 if(kind==='style')return (styles[value]||[value]).some(x=>has(get(p,'style','Style'),x));
 if(kind==='room')return has(get(p,'room','Room'),value)||(value==='Outdoor'&&has(get(p,'indoorOutdoor','Indoor / Outdoor'),'Outdoor'));
 if(kind==='brand')return has(p.brand,value);
 if(dept==='Art'){
  if(kind==='subject')return (value==='Floral & Botanical'?['Floral','Botanical']:value==='People'?['People','Figurative','People / Figurative']:[value]).some(x=>has(get(p,'subject','Subject'),x));
  if(kind==='large')return largeArt(p);
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
  if(kind==='type')return window.MirrorFilters.values(p,'type').includes(value);
  if(kind==='shape')return window.MirrorFilters.values(p,'shape').includes(value);
  if(kind==='large')return large(p);
  // An editorial selection of existing supplied mirror products, not a new specification.
  if(kind==='statement')return ['567929','468821','468814','469033','252010'].includes(p.imageKey);
 }
 if(dept==='Clocks'){
  if(kind==='type')return window.ClocksFilters.values(p,'type').includes(value);
  if(kind==='face')return window.ClocksFilters.values(p,'face').includes(value);
  if(kind==='dial')return window.ClocksFilters.values(p,'dial').includes(value);
  if(kind==='wallSize')return window.ClocksFilters.values(p,'type').includes('Wall Clocks')&&(value==='Large'?['Large','Oversized'].includes(p.size):p.size==='Small');
 }
 return false;
}
function resolve(dept,params,products){const kind=params.get('nav'),value=params.get('value')||'';if(!kind||!['Art','Mirrors','Clocks'].includes(dept))return null;return {title:params.get('label')||value||dept,products:products.filter(p=>match(dept,p,kind,value))};}
window.VersionBMegaRoutes={resolve,match};
})();
