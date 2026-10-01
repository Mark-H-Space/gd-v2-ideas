const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
const read=s=>JSON.parse(s.slice(s.indexOf('=')+1).trim().replace(/;$/,''));
const current=read(fs.readFileSync('dist/catalogue-data.js','utf8'));
const before=read(cp.execFileSync('git',['show','HEAD:dist/catalogue-data.js'],{encoding:'utf8'}));
assert.deepEqual(current.departments,before.departments);
assert.deepEqual(current.products.filter(p=>p.dept!=='Art'),before.products.filter(p=>p.dept!=='Art'));
const ps=current.products.filter(p=>p.dept==='Art'),report=JSON.parse(fs.readFileSync('checks/gallery-art-import-report.json'));
assert.equal(ps.length,20);assert.equal(new Set(ps.map(p=>p.sku)).size,20);assert.equal(report.importedImageCount,88);
const map=new Map(report.assets.map(a=>[a.asset,a]));
for(const p of ps){assert(p.barcode.endsWith(p.imageKey));assert(p.realGalleryArt&&p.isCatalogue);assert(p.images.length>1);assert.equal(p.image,p.images[0]);assert(map.get(p.image).primary);for(const src of p.images){assert(fs.statSync('dist/'+src).size>0);assert.equal(map.get(src).imageKey,p.imageKey);}for(const key of ['tradePrice','freeStock','incomingStock','factoryCost','navNlc','margin','moq','sales','ros'])assert(!(key in p));assert.equal(p.colour,'');assert.equal(p.style,'');assert.equal(p.width_mm,null);assert.equal(p.height_mm,null);}
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('dist/art-filters.js','utf8'),ctx);const f=ctx.window.ArtFilters;
assert.equal(ps.filter(p=>f.values(p,'type').includes('Canvas')).length,15);assert.equal(ps.filter(p=>f.values(p,'type').includes('Framed Art')).length,5);
assert.equal(f.values(ps.find(p=>p.imageKey==='060480'),'pieces')[0],'Set of 2');
assert.equal(ps.find(p=>p.imageKey==='054526').subject,'Botanical');assert.equal(ps.find(p=>p.imageKey==='054571').subject,'Animals');assert.equal(ps.find(p=>p.imageKey==='054328').colour,'');
assert.equal(report.archiveUnmatchedImageKeys.length,5);
console.log('Passed: 20 Art products, 88 local images, barcode/primary matching, Art facets, no fabricated specifications, no commercial fields, unchanged other departments.');
