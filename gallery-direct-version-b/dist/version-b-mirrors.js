(() => {
const params=new URLSearchParams(location.search),category=params.get('mirrorCategory');
if(!document.querySelector('#mirror-grid'))return;
if(category)window.MIRROR_PRODUCTS=window.MIRROR_PRODUCTS.filter(p=>(p.mirrorCategory||[]).includes(category));
const menuRoute=window.VersionBMegaRoutes?.resolve('Mirrors',params,window.MIRROR_PRODUCTS);if(menuRoute)window.MIRROR_PRODUCTS=menuRoute.products;
const products=window.MIRROR_PRODUCTS;
window.CATALOGUE_CONTEXT={dept:'Mirrors',title:menuRoute?.title||category||'Mirrors',...window.MirrorFilters.configure(products),furniture:true};
if(category||menuRoute){const title=menuRoute?.title||category;document.querySelector('#category-title').textContent=title;document.querySelector('#category-breadcrumbs').innerHTML='<a href="index.html">Home</a><span>/</span><a href="mirrors.html">Mirrors</a><span>/</span><strong>'+title.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))+'</strong>';}
for(const a of document.querySelectorAll('.subcategory-strip a')){const selected=!menuRoute&&new URL(a.href,location.href).searchParams.get('mirrorCategory')===category;a.classList.toggle('is-active',selected);a.setAttribute('aria-current',selected?'page':'false');}
})();
