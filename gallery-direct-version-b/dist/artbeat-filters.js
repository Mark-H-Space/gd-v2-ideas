(() => {
'use strict';
const colour=['Black','White','Cream','Beige','Brown','Grey','Green','Blue','Pink','Red','Orange','Yellow','Gold','Silver','Multi-colour'];
const themes=['Floral','Botanical','Animals','Humour','Typography','Illustration','Photography','Pattern','Kids','Nature','Contemporary','Traditional'];
const styles=['Contemporary','Traditional','Modern','Minimalist','Fun / Playful','Elegant','Illustrated','Photographic'];
const fields={occasion:['occasion','Occasion'],recipient:['recipient','Recipient'],theme:['theme','Theme'],packSize:['tradePackQuantity','Trade Pack Quantity','Pack Quantity','packQuantity'],finish:['finish','Finish'],format:['cardFormat','Card Format','cardSize','Card Size','sizeCode','Size Code','Format / Size'],style:['style','Style']};
const clean=v=>v!==undefined&&v!==null&&v!==''&&!['Not supplied','Not specified','Not applicable','Any'].includes(v);
const stock={'In stock':'In Stock','In Stock':'In Stock',Incoming:'Due Soon / Incoming','Coming soon':'Due Soon / Incoming','Due Soon':'Due Soon / Incoming','Due Soon / Incoming':'Due Soon / Incoming','Pre-order':'Pre-order'};
function values(p,k){let v=(fields[k]||[k]).map(f=>p[f]).find(clean);return (Array.isArray(v)?v:[v]).filter(clean).map(x=>{if(k==='occasion'&&['Blank','Blank Cards','Everyday','General'].includes(x))return 'General / Everyday';if(k==='packSize'){const n=Number(x);return Number.isInteger(n)&&n>0?'Pack of '+n:null;}if(k==='availability')return stock[x];if(k==='colour'&&['Multicolour','Multi Colour'].includes(x))return 'Multi-colour';return x;}).filter(clean).filter(x=>k!=='colour'||colour.includes(x)).filter(x=>k!=='theme'||themes.includes(x)).filter(x=>k!=='style'||styles.includes(x)).filter(x=>k!=='format'||!['Small','Medium','Large','Extra large'].includes(x));}
function numeric(p,k){if(k!=='price')return null;const v=[p.tradePrice,p['Trade Price']].find(clean);return typeof v!=='boolean'&&v!==undefined&&Number.isFinite(Number(v))&&Number(v)>=0?Number(v):null;}
function configure(products){const has=k=>products.some(p=>values(p,k).length);const consistent=k=>products.length>0&&products.filter(p=>values(p,k).length).length/products.length>=.8;
const labels={};if(has('occasion'))labels.occasion='Occasion';if(has('recipient'))labels.recipient='Recipient';if(has('theme'))labels.theme='Theme';if(has('packSize'))labels.packSize='Pack Size';if(consistent('finish'))labels.finish='Finish';if(has('availability'))labels.availability='Availability';
if(has('format'))labels.format='Format / Size';if(has('colour'))labels.colour='Colour';if(consistent('style'))labels.style='Style';labels.price='Price';
return {labels,facetOptions:{},numericFacets:['price'],initialOpen:['occasion','packSize'],artbeat:true,filterHeading:'Filter Artbeat Cards',filterNote:'Filters use Artbeat sample attributes. Verify trade pack quantities and availability against the approved Artbeat catalogue.'};}
window.ArtbeatFilters={configure,values,numeric};
})();
