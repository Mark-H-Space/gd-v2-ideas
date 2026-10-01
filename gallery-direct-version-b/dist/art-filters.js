(() => {
'use strict';
const lists={
type:['Framed Art','Canvas','Print Sets','Photography','Metal Wall Art'],
subject:['Abstract','Landscape','Botanical','Animals','Coastal','People / Figurative','Architecture','Typography','Still Life','Photography'],
orientation:['Portrait','Landscape','Square','Panoramic'],
colour:['Black','White','Neutral','Brown','Grey','Blue','Green','Pink','Red','Orange','Yellow','Gold','Silver','Multi-colour'],
style:['Contemporary','Modern','Abstract','Traditional','Minimalist','Botanical','Coastal','Vintage'],
frameColour:['Black','White','Natural','Brown','Gold','Silver'],
frameMaterial:['Wood','Metal','MDF / Composite'],
room:['Living Room','Dining Room','Bedroom','Hallway','Office','Commercial / Hospitality'],
medium:['Print','Canvas','Textured','Embellished','Glass Fronted','Metal'],
pieces:['Single','Set of 2','Set of 3','Multi-piece']};
const fields={type:['artType','Art Type','type'],subject:['subject','Subject'],orientation:['orientation','Orientation'],style:['style','Style'],frameColour:['frameColour','Frame Colour'],frameMaterial:['frameMaterial','Frame Material'],room:['room','Room'],medium:['medium','Medium / Finish','Medium','finish','Finish'],pieces:['numberOfPieces','Set / Number of Pieces','Number of Pieces','pieces'],artist:['artist','designer','Artist / Designer','Artist','Designer']};
const aliases={type:{'Canvas Art':'Canvas','Art Sets':'Print Sets'},colour:{Natural:'Neutral',Cream:'Neutral',Beige:'Neutral',Multicolour:'Multi-colour','Multi Colour':'Multi-colour','Multi-coloured':'Multi-colour'},subject:{Figurative:'People / Figurative',People:'People / Figurative'},frameMaterial:{MDF:'MDF / Composite',Composite:'MDF / Composite'},availability:{'In stock':'In Stock','In Stock':'In Stock',Incoming:'Due Soon / Incoming','Due soon':'Due Soon / Incoming','Due Soon':'Due Soon / Incoming','Due Soon / Incoming':'Due Soon / Incoming','Pre-order':'Pre-order'}};
const clean=v=>v!==undefined&&v!==null&&v!==''&&!['Not supplied','Not specified','Not applicable'].includes(v);
function values(p,k){let v=(fields[k]||[k]).map(f=>p[f]).find(clean);if(k==='medium'&&!clean(v)&&['Canvas','Canvas Art','Metal Wall Art'].includes(p.type))v=p.type==='Metal Wall Art'?'Metal':'Canvas';return (Array.isArray(v)?v:[v]).filter(clean).map(x=>{if(k==='pieces'&&/^\d+$/.test(String(x))){const n=Number(x);return n===1?'Single':n===2?'Set of 2':n===3?'Set of 3':n>3?'Multi-piece':null;}return aliases[k]?.[x]||x;}).filter(clean).filter(x=>!lists[k]||lists[k].includes(x)).filter(x=>k!=='availability'||Object.values(aliases.availability).includes(x));}
function numeric(p,k){const keys=k==='price'?['tradePrice','Trade Price']:[k+'Mm',k+'_mm',k[0].toUpperCase()+k.slice(1)+' (mm)'];const v=keys.map(f=>p[f]).find(clean);return v!==undefined&&Number.isFinite(Number(v))&&Number(v)>=0?Number(v):null;}
function framed(p){return p.type==='Framed Art'||p['Art Type']==='Framed Art'||p.framed===true||values(p,'frameColour').length>0||values(p,'frameMaterial').length>0;}
function configure(products){const labels={type:'Art Type',subject:'Subject',orientation:'Orientation',width:'Width',height:'Height',colour:'Colour',style:'Style',availability:'Availability'};
const framedProducts=products.filter(framed);if(framedProducts.length){labels.frameColour='Frame Colour';if(framedProducts.some(p=>values(p,'frameMaterial').length))labels.frameMaterial='Frame Material';}
labels.room='Room';if(products.some(p=>values(p,'medium').length))labels.medium='Medium / Finish';
if(products.some(p=>values(p,'pieces').length||/Sets|Set$/.test(p.type)))labels.pieces='Set / Number of Pieces';
if(products.some(p=>values(p,'artist').length))labels.artist='Artist / Designer';labels.price='Price';
return {labels,facetOptions:lists,numericFacets:['width','height','price'],art:true};}
window.ArtFilters={configure,values,numeric};
})();
