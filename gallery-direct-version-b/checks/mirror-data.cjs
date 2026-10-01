const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{addEventListener(){}},document:{querySelector(){return null},querySelectorAll(){return[]},addEventListener(){}},localStorage:{getItem(){return null}},location:{search:''},URLSearchParams,requestAnimationFrame(){}};
vm.createContext(context);vm.runInContext(fs.readFileSync('dist/mirror-data.js','utf8'),context);vm.runInContext(fs.readFileSync('dist/preview.js','utf8'),context);
const {products,matches,selectProducts}=context.window.GalleryPreview;
assert.equal(products.length,20);assert.equal(new Set(products.map(p=>p.sku)).size,20);
for(const p of products){assert(p.name&&p.barcode&&p.imageKey);assert(fs.existsSync('dist/'+p.image));assert(p.images.length>=1);assert(selectProducts({},p.sku,'featured').some(x=>x.sku===p.sku));}
assert.equal(selectProducts({},'', 'featured').length,20);
assert(selectProducts({shape:['Round']},'','featured').every(p=>p.shape==='Round'));
assert(selectProducts({colour:['Black','Gold']},'','featured').every(p=>['Black','Gold'].includes(p.colour)));
assert(selectProducts({shape:['Round'],colour:['Black']},'','featured').every(p=>p.shape==='Round'&&p.colour==='Black'));
assert.equal(selectProducts({},'Windsor','featured').length,1);
assert.equal(selectProducts({},'does-not-exist','featured').length,0);
assert.equal(selectProducts({},'5056693567929','featured')[0].sku,'567929');
assert.equal(selectProducts({},'','recent')[0].sku,products.at(-1).sku);
const names=Array.from(selectProducts({},'','name'),p=>p.name);assert.deepEqual(names,[...names].sort((a,b)=>a.localeCompare(b)));
assert(matches(products[0],{colour:['Impossible']},'','colour'));
console.log('Passed: 20 unique product routes, assets, search, OR/AND filters, facet counts and sorting.');

const report=JSON.parse(fs.readFileSync('checks/gallery-mirror-import-report.json'));
assert.equal(report.primaryImageProductCount,20);assert.equal(report.alternateImageProductCount,20);
assert.equal(products.reduce((n,p)=>n+p.images.length,0),106);
const assetMap=new Map(report.assets.map(a=>[a.asset,a]));
for(const p of products){assert(p.barcode.endsWith(p.imageKey));assert(p.images.length>1);assert(assetMap.get(p.image).primary);for(const src of p.images){assert(fs.existsSync('dist/'+src));assert.equal(assetMap.get(src).imageKey,p.imageKey);}for(const field of ['tradePrice','freeStock','incomingStock','factoryCost','navNlc','margin','moq','sales','ros'])assert(!(field in p));assert.equal(p.style,'');}
const windsor=products.find(p=>p.imageKey==='567929');assert.equal(windsor.shape,'Round');assert.equal(windsor.width_mm,910);assert.equal(windsor.height_mm,910);assert.equal(windsor.colour,'');assert.equal(windsor.images.length,8);
const abbey=products.find(p=>p.imageKey==='403181');assert.equal(abbey.width_mm,null);assert.equal(abbey.height_mm,null);assert.equal(abbey.colour,'Cream');assert(abbey.mirrorCategory.includes('Leaner Mirrors'));
assert.equal(report.archiveUnmatchedImageKeys.length,65);
console.log('Passed: 20 primary/alternate galleries, 106 local assets, barcode matching, conservative dimensions and commercial-field exclusion.');
