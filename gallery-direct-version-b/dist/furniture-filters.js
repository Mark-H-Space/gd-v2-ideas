(() => {
'use strict';
const lists={
type:['Sofas & Armchairs','Beds','Dining Tables','Dining Chairs','Coffee Tables','Side Tables','Console Tables','Sideboards','Bookcases','TV Units','Desks','Stools','Storage','Shelving','Benches'],
colour:['Black','White','Cream','Beige','Brown','Grey','Green','Blue','Pink','Red','Orange','Yellow','Gold','Silver','Natural','Clear'],
material:['Wood','Metal','Glass','Stone / Marble','Fabric','Leather / Faux Leather','Rattan / Cane','MDF / Engineered Wood'],
style:['Contemporary','Modern','Traditional','Industrial','Scandi','Rustic','Art Deco','Mid-Century','Classic'],
finish:['Natural','Painted','Stained','Matt','Gloss','Brushed','Polished','Antique / Aged','Distressed','Textured'],
shape:['Round','Oval','Rectangle','Square','Organic / Irregular']};
const aliases={type:{Sofas:'Sofas & Armchairs','Sofa Beds':'Sofas & Armchairs','Armchairs & Accent Chairs':'Sofas & Armchairs','Armchairs':'Sofas & Armchairs','Accent Chairs':'Sofas & Armchairs','Bed Frames':'Beds','Bedside Tables':'Side Tables','Side & Lamp Tables':'Side Tables','Bar Stools':'Stools',Cabinets:'Storage',Wardrobes:'Storage','Chests of Drawers':'Storage','Chest of Drawers':'Storage','Shelving Units':'Shelving'},material:{Marble:'Stone / Marble',Stone:'Stone / Marble',Leather:'Leather / Faux Leather','Faux Leather':'Leather / Faux Leather',Rattan:'Rattan / Cane',Cane:'Rattan / Cane',MDF:'MDF / Engineered Wood','Engineered Wood':'MDF / Engineered Wood'},availability:{'In stock':'In Stock','In Stock':'In Stock',Incoming:'Due Soon / Incoming','Due soon':'Due Soon / Incoming','Due Soon':'Due Soon / Incoming','Due Soon / Incoming':'Due Soon / Incoming','Pre-order':'Pre-order','Made to order':'Made to Order','Made to Order':'Made to Order'}};
const fieldAliases={style:['style','Style'],room:['room','Room'],finish:['finish','Finish'],shape:['shape','Shape'],upholstery:['upholstery','Upholstery'],capacity:['seatingCapacity','Seating Capacity','Seats or Capacity'],assembly:['assemblyType','Assembly Type'],doors:['numberOfDoors','Number of Doors'],drawers:['numberOfDrawers','Number of Drawers']};
const clean=v=>v!==undefined&&v!==null&&v!==''&&!['Not supplied','Not specified','Not applicable'].includes(v);
function values(p,k){let v=(fieldAliases[k]||[k]).map(f=>p[f]).find(clean);return (Array.isArray(v)?v:[v]).filter(clean).map(x=>aliases[k]?.[x]||x).filter(x=>!lists[k]||lists[k].includes(x)).filter(x=>k!=='availability'||Object.values(aliases.availability).includes(x));}
function numeric(p,k){const keys=k==='price'?['tradePrice','Trade Price']: [k+'Mm',k+'_mm',k[0].toUpperCase()+k.slice(1)+' (mm)'];const v=keys.map(f=>p[f]).find(clean);return v!==undefined&&Number.isFinite(Number(v))&&Number(v)>=0?Number(v):null;}
const seating=t=>/Sofas|Armchairs|Chairs|Stools|Benches|Footstools|Pouffes/.test(t);
const capacity=t=>/Sofas|Sofa Beds|Dining Tables|Chairs|Benches/.test(t);
const storage=t=>/Cabinets|Sideboards|Storage|Wardrobes|Bookcases|Shelving|Drawers|TV Units/.test(t);
const shape=t=>/Tables|Desks|Stools|Benches|Footstools|Pouffes/.test(t);
function configure(products,sub,group){const types=products.map(p=>p.type).concat(!sub&&!group?lists.type:[]).concat(sub?[sub]:group==='Seating'?['Sofas']:group==='Tables & Storage'?['Tables','Storage']:[]);
const labels={type:'Product Type',width:'Width',height:'Height',depth:'Depth',colour:'Colour',material:'Material',style:'Style',availability:'Availability',collection:'Range / Collection',room:'Room',finish:'Finish'};
if(types.some(shape))labels.shape='Shape';labels.price='Price';
if(types.some(seating))labels.upholstery='Upholstery';if(types.some(capacity))labels.capacity='Seating Capacity';
if(products.some(p=>values(p,'assembly').length))labels.assembly='Assembly Type';
if(types.some(storage))labels.doors='Number of Doors';if(types.some(t=>storage(t)||/Desks|Console Tables/.test(t)))labels.drawers='Number of Drawers';
return {labels,facetOptions:lists,numericFacets:['width','height','depth','price'],furniture:true};}
window.FurnitureFilters={configure,values,numeric};
})();
