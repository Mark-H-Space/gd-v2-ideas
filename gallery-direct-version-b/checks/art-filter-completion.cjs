const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),cp=require('child_process');
const c={window:{addEventListener(){}},requestAnimationFrame(){},document:{querySelector(){return null},querySelectorAll(){return[]},addEventListener(){}},location:{search:''},localStorage:{getItem(){return null}},URLSearchParams};vm.createContext(c);
for(const f of ['catalogue-data.js','version-b-filters.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),c);
const products=c.window.GALLERY_CATALOGUE.products.filter(p=>p.dept==='Art'),a=c.window.ArtFilters,config=a.configure(products);
assert.equal(products.length,20);assert.equal(Object.keys(config.labels).length,15);assert(config.omitFilterNote);assert.equal(config.filterNote,'');
for(const p of products){assert(a.numeric(p,'width')>0);assert(a.numeric(p,'height')>0);assert.equal(a.values(p,'orientation').length,1);assert(a.values(p,'subject').length);assert(a.values(p,'colour').length);for(const k of ['style','artist','frameMaterial','room'])assert.equal(a.values(p,k).length,0);}
assert.equal(a.numeric(products.find(p=>p.sku==='048747'),'width'),1210);assert.equal(a.numeric(products.find(p=>p.sku==='048747'),'height'),530);
assert(a.values(products.find(p=>p.sku==='060480'),'type').includes('Art Sets'));assert.equal(a.numeric({width_mm:123,sku:'048747',realGalleryArt:true},'width'),123);assert.equal(a.numeric({rrp:200},'price'),null);
c.window.MIRROR_PRODUCTS=products;c.window.CATALOGUE_CONTEXT=config;vm.runInContext(fs.readFileSync('dist/preview.js','utf8'),c);
const matches=c.window.GalleryPreview.matches;
assert(matches(products.find(p=>p.sku==='048747'),{width:['1210','1210'],height:['530','530'],orientation:['Panoramic / Long']},''));
assert(!matches(products.find(p=>p.sku==='048747'),{width:['','1209']},''));
assert.equal(products.filter(p=>matches(p,{subject:['Animals']},'')).length,5);
assert(products.filter(p=>matches(p,{colour:['Green'],availability:['In Stock']},'')).length);
// Render the actual filter function without constructing the unrelated PLP UI.
const panel={dataset:{},classList:{toggle(){}},innerHTML:'',querySelector(){return{addEventListener(){}}}};c.document.querySelector=s=>s==='#mirror-filters'?panel:null;
const source=fs.readFileSync('dist/preview.js','utf8');let instrumented=source.replace('function renderFilters(){','window.TestRenderFilters=renderFilters;function renderFilters(){');vm.runInContext(instrumented,c);c.window.TestRenderFilters();
assert.equal((panel.innerHTML.match(/<details /g)||[]).length,15);assert(!panel.innerHTML.includes('filter-data-note'));assert(panel.innerHTML.includes('Specification not supplied.'));assert(!/id="width-Min"[^>]*disabled/.test(panel.innerHTML));assert(/id="price-Min"[^>]*disabled/.test(panel.innerHTML));
const old={window:{}};vm.createContext(old);vm.runInContext(cp.execFileSync('git',['show','HEAD:dist/version-b-filters.js'],{encoding:'utf8'}),old);
for(const name of ['MirrorFilters','ClocksFilters','ArtbeatFilters'])for(const p of [products[0],{type:'Wall Clocks',colour:'Blue',availability:'In stock',diameter_mm:600}]){const strip=o=>{const v=JSON.parse(JSON.stringify(o));delete v.omitFilterNote;return v};assert.deepEqual(strip(c.window[name].configure([p])),strip(old.window[name].configure([p])));}
// Product catalogue and all structural assets are unchanged.
for(const f of ['dist/catalogue-data.js','dist/preview.css','dist/version-b-menus.css'])assert.equal(fs.readFileSync(f,'utf8'),cp.execFileSync('git',['show','HEAD:'+f],{encoding:'utf8'}));
console.log('Passed: 15 Art filters, 20 reviewed orientations/dimensions/subjects/colours, combined filters, rendered empty architecture, no footer note, no other-department or design changes.');
