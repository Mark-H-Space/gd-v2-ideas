# Gallery Direct navigation preview — Magento developer handoff

This repository is an interactive static concept, not a Magento theme or connected trade catalogue. It demonstrates homepage routing, department and subcategory labels, filters, mobile navigation, product cards and a sample PDP. The clock sample uses Thomas Kent names, SKUs and images; most other sample products and commercial values are illustrative.

## Proposed Magento implementation

1. Confirm Gallery's exact Magento/Adobe Commerce version, current theme, B2B modules, search engine and hosting constraints. Work in a staging clone with anonymised or approved catalogue data.
2. Inventory the current category tree, product attributes, attribute sets, option values, category assignments, images and customer-specific visibility. Export a SKU-level sample from each department, including parent/variant relationships.
3. Define canonical product type, department, shopper-facing category, attributes and controlled option values. A SKU can appear in multiple curated categories, but its intrinsic facts (shape, size, material, colour, clock movement, card occasion) should have one authoritative source. Document units and missing values.
4. Map the approved taxonomy to Magento categories and attributes. Configure storefront filterability only where populated and useful; keep stock, price and account visibility tied to the existing trade rules. Build the homepage, mega menu, mobile drawer, PLP and PDP as theme components rather than embedding this prototype script.
5. Import into a staging catalogue, validate SKU counts, category overlap, facet counts, zero-result states, redirects and mobile behaviour. Test as guest and as representative trade accounts before rollout.

## Inputs needed from Gallery

- Magento version, theme source and deployment process; staging access from the developer.
- Current category/attribute exports and a product export with SKU, type, attributes, assignments and image roles.
- Approved homepage assets and brand font name/files or computed CSS values, plus rights and responsive crop guidance.
- Trade permissions, stock/price sources, pack quantities, lead times, order minimums and customer group rules.
- A decision on provisional categories (especially Mattresses) and approved copy for editorial collections.

## Media behaviour

The homepage concept has two editorial slides with touch scroll and position dots. The production PDP should use a product's actual media gallery. Render swipe controls and image indicators only when more than one distinct image exists; use thumbnails or a visible image count for discoverability. Never manufacture extra product views from a category lifestyle image.

## Local build and sharing

Adobe documents Docker-based local development for Adobe Commerce. A developer should provision a matching environment for Gallery's exact version and extensions, then share a Git branch and a protected staging URL for stakeholder review. A local machine alone is not a dependable shared review environment. No Magento installation, admin account, or integration has been created by this prototype.

## Product evaluation update — 30 September 2026

The prototype now uses 73 genuine catalogue image URLs across 14 Thomas Kent SKUs. It adds a compact square PDP gallery with desktop side thumbnails, mobile thumbnails below, next/previous controls, swipe, an enlarged-image dialog and keyboard navigation. Listing cards offer three selectable photo previews and a secondary image on hover for fine-pointer devices. Images and titles link to the PDP. Returning to the listing retains filters and restores the previous page position. Products with a single image do not receive invented alternatives.

### Theme implementation

For Magento Blank/Luma-derived themes, start with the existing `mage/gallery/gallery` widget and the child theme’s `etc/view.xml`. Adobe documents thumbnail navigation (`nav: thumbs`), vertical/horizontal navigation direction, responsive breakpoints, swipe, fullscreen and keyboard options. Configure desktop thumbnails vertically and mobile thumbnails horizontally; style the surrounding template and LESS to match the approved preview. Confirm the installed version and theme before using these options. Hyvä and other custom storefronts require their own gallery implementation rather than assuming Magento's jQuery widget is present.

PLP secondary-photo previews require a theme extension to the product-list template and its image data. Serve resized thumbnails, load extra photos lazily, and avoid per-card database queries. Preserve configurable-product media switching and account/customer-group visibility. Keep primary product images uncropped. Use clear focus states and touch controls; never make hover the only way to inspect another image.

### Trade data and acceptance

Place approved dimensions, material, finish and product code near the gallery. The live ordering area should use the existing account price, VAT basis, stock/lead-time, minimum order and pack rules. These are integration requirements; the static preview does not simulate a trade order. Continue to prioritise fast SKU search and a return path to the filtered listing.

Validate on Gallery staging at desktop, tablet and mobile widths, with keyboard and touch, at 200% text size, with one-image and eight-image products, and as guest and permitted trade accounts. Verify alternate photos belong to the exact SKU and that responsive image sources load successfully.

### Research supporting these choices

- Baymard: [Product gallery thumbnails](https://baymard.com/research-articles/always-use-thumbnails-additional-images) — keep actual thumbnails visible on mobile as well as desktop.
- Baymard: [Additional product-list images](https://baymard.com/research-articles/secondary-hover-information) — offer explicit ways to inspect extra views, in addition to hover.
- Adobe: [Gallery widget](https://developer.adobe.com/commerce/frontend-core/javascript/jquery-widgets/gallery) — implementation options for traditional Magento themes.

The CSS is authored for this preview from these interaction requirements; it is not a copied third-party theme. Exact Gallery brand typography still needs the approved font or current theme source.

## Connected supplied designs — 30 September 2026

The current entry point is the supplied homepage v29, connected through a Wall Decor hub to the Mirrors PLP v5 and reusable PDP v3. `product.html?sku=…` selects the matching record for each of the 12 supplied mirror samples. `catalogue.html` preserves the earlier departmental concept and Thomas Kent gallery. The original upload filenames redirect to the connected pages.

The mirror listing provides combined facets with counts, search, applied-filter removal, empty states, name sorting and reversed sample order. There are no supplied dates or trade prices to support newness or price sorting. Boards and recently viewed items are local device previews. Live account links lead to Gallery; no trade order or Magento account integration has been implemented.

Embedded image duplication was replaced with six shared local WebP assets, approximately 1.18 MB total. The supplied Hayle gallery included unrelated furniture, artwork and greeting-card images. The mirror pages retain only the appropriate room reference and label it clearly. Genuine distinct SKU photos are needed before multiple thumbnails or hover alternatives can appear. The gallery code supports multiple images when they are supplied; one-image records hide unnecessary arrows and thumbnails. Other mirror records use their own supplied names and dimensions without copying Hayle specifications into them.

The page retains normal document scrolling. Menu, filter and category overflow hide their native scrollbars and provide usable circular arrow controls. Production theme work should preserve keyboard access, focus restoration, touch scrolling and visible overflow cues. These static HTML/CSS/JS files are a design and interaction reference to translate into the confirmed Magento theme, not an installable Magento package.

### Shared homepage styling

`gallery-theme.css` is the homepage stylesheet shared by the homepage, Wall Decor hub, mirror PLP and mirror PDP. Each uses the same homepage header, navigation and mobile drawer markup. `gallery-page-theme.css` aligns listing/detail headings, body copy, card titles, form fonts, buttons and surfaces with the homepage typography and colours. Page-specific layout rules remain in their own HTML. Updated asset URLs invalidate older cached styles. Carry these shared design rules into the Magento theme's common styles and shared header templates.

### Department image correction

Shop by department now uses the seven original Gallery media URLs specified in the latest uploaded homepage v29, together with its locally optimised embedded mattress photo. `department-image-sources.json` records the exact mapping. The Outdoor photo replaces the temporary text tile. Gallery returned HTTP 403 to the local image-download attempt, so the seven original images remain referenced at their Gallery URLs rather than being copied locally. Their delivery depends on Gallery's media host; approved image files should be hosted as theme assets for production.

## All category listings use the agreed PLP

`mirrors.html` and `catalogue.html` now share the mirror PLP layout: full-width image with sage overlay and white category heading/breadcrumb/count, category shortcuts, filter sidebar/mobile drawer, applied filters, sort and product cards. All existing category menu URLs resolve through `catalogue.html?dept=…&sub=…`; no clock listing uses the former catalogue layout. Category context selects the title, hero, records and relevant populated facets, including wall, cuckoo, mantel and other clock routes. The 14 Thomas Kent records and their genuine galleries remain available through the shared product detail template. Other departmental records retain their explicit sample status; missing product photography is shown as a placeholder rather than an unrelated mirror photo. New, Sale and Made to Order have empty collection states until approved assignments are supplied. The existing inspiration surface is retained separately from PLPs.

`catalogue-source-data.json` retains the previous sample dataset; `catalogue-data.js` supplies the normalized records. `catalogue-context.js` prepares the category and populated facets before the common renderer. Validation covers all department contexts, clock subroutes, product galleries, matching layout/header markup and local links.


## Navigation audit — 30 September 2026
The canonical desktop/mobile menu is recorded in navigation-taxonomy.json. Use one primary category per product type; mirror shapes and art subjects remain filters. Group headings must use group membership rather than open an unrelated department. Made to Order upholstery and mattresses are supported by Gallery’s official help pages; no existing mattress sample has been assumed to be made to order. New, Sale and Made to Order require approved product assignments.

Before category sign-off, reconcile the entire active product export with this tree, including seasonal ranges, accessories and specialist lighting. Assess weak categories using active parent SKU breadth, replenishment and sales rather than preview counts. The public storefront was inaccessible during this audit, so exhaustive coverage and commercial strength are unverified. See dist/navigation-review.html for Nigel’s review.

Mirror categories now match Mark’s reference: Wall, Full Length, Leaner, Free Standing, Over Mantel and Storage Mirrors. Shape remains a separate filter. Full length sample membership is inferred only for existing leaners with a supplied dimension >=140cm; verify using approved taxonomy. No free-standing or storage products have been invented.

Lighting menu reconciled to Mark’s supplied 30 September screenshot: all ten labels retained, with Outdoor Wall Lights retained additionally. Wall Fitting and Wall Lights remain separate until Gallery confirms their distinction. Design Series uses collection membership. No missing sample products or technical specifications invented.

Textiles uses five grouped menu destinations with precise product types in PLP filters. Kitchen/Table Linen aggregate their component types. Bench Pads merged with Seat & Bench Pads. Occasional Seating stays under Furniture; Decorations/Christmas retain existing Accessories seasonal routes pending product classification. Missing sample types have zero counts, without invented inventory.

Outdoor reconciled to Mark’s screenshot in four groups. Stool/Stools merged. Outdoor mirror and solar lantern routes are scoped to Outdoor Living. Garden Ornaments retained from Accessories audit. Parasol Bases and Covers & Care removed from menu pending range confirmation; no product records deleted.


## Furniture filters — 1 October 2026
Furniture PLP filters now use the supplied master taxonomy and ordered specification fields. This is an isolated Furniture adapter; menu, product records, cards, other departments and responsive drawer behaviour are preserved. Width, Height and Depth use inclusive Min/Max controls in millimetres, accepting explicit widthMm/heightMm/depthMm, snake-case equivalents or labelled “Width (mm)” fields. Missing dimensions are never inferred from Small/Medium/Large or ambiguous display dimensions. All current Furniture samples lack numeric measurements; controls are disabled with a missing-data message until approved specifications are supplied. Price accepts tradePrice/Trade Price only, never RRP; current prices are unavailable. Master values with no sample matches remain visible but disabled. Availability includes only supported states. Conditional facets depend on the category/product types; assembly appears only when specified. Collection/room/finish and conditional fields without attributes show a missing-specification message when expanded. Port the same master mapping and numeric range semantics to Magento layered navigation using verified SKU attributes.


## Art filters — 1 October 2026
Art-only filters follow the requested primary/secondary ordering. The existing Art menu, routes, cards, records and layout remain unchanged. The filter adapter maps Canvas Art to Canvas, the prototype Art Sets category to Print Sets and Natural/Cream/Beige to Neutral; confirm set format against approved SKU data during Magento implementation. Width/Height use explicit millimetre attributes and inclusive Min/Max bounds, with no size-band conversion. Current Art samples lack measurements and trade prices, so controls indicate missing data and remain disabled. Frame Colour appears only with framed products; Frame Material requires explicit frame-specific attributes (generic artwork material is not reused). Medium requires supplied attributes or a Canvas/Metal Wall Art type. Piece-count controls appear for sets or supplied counts, without inventing how many pieces a set contains. Artist is absent until supplied. Availability is restricted to the three requested states that occur in data. Master options with no matching sample are disabled.


## Lighting filters — 1 October 2026
Lighting PLPs now use the requested ordered master taxonomy and specification filters without changing existing menu destinations, product records, cards or layout. Existing Bulb Cap attributes supply Bulb Type; only supported bulb values and stock states are shown. IP Rating is primary and opens on bathroom/outdoor categories; no IP certification is inferred. Integrated LED fittings omit replaceable-bulb type/inclusion values. Shade Material requires a shade-specific attribute, an explicit hasShade flag or a shade product; generic material is not repurposed. Adjustable is limited to task/desk/wall/floor categories. Number of Lights is limited to fittings and does not infer counts. Depth appears for supplied depths or wall/desk/floor/task fittings. Width/Height/Depth use explicit mm attributes, not size bands. Max Wattage uses explicit numeric specifications and Min/Max in W; it is hidden without numeric data. Current samples lack dimensions, wattage and trade prices, so measurements and price are unavailable. Indoor/Outdoor uses supplied attributes, with Outdoor classification supported by the explicit Outdoor product type; no indoor suitability or certification is guessed. New adapters remain isolated to their departments.


## Textiles filters — 1 October 2026
Soft Furnishings/Textiles now uses the requested master Product Type values while preserving existing menu routes. Bedding/table-linen subtypes map into their parent filter values; category-specific table-linen filters preserve subtype refinement. Outdoor cushion/throw types map to those master types. Only supplied, recognised textile materials are exposed; current Wood/Metal placeholders are excluded and not guessed from names. Width and Length / Height use explicit mm attributes, never Small/Medium/Large bands. Rug length and cushion height use their supplied attributes. Specialised cushion/bedding/rug/table-linen filters are scoped to category/group pages, not the department root. Rug construction, care, packs, blind and towel attributes require supplied data. Curtain heading/lining requires at least two curtain samples as a provisional breadth rule; replace this with active catalogue coverage when porting to Magento. Curtain width/drop reuse the existing two primary numeric controls to avoid duplicates. Current samples lack mm measurements, textile materials and trade prices, so missing specifications remain unavailable. No product records, navigation or other departments were changed.


## Accessories filters — 1 October 2026
Home Accessories filters now use the requested master taxonomy and ordered specification fields. Width/Height/Depth appear by product relevance; trays use Width/Depth, candle holders Height, bowls Width / Diameter, baskets all three. Numeric controls accept explicit mm attributes and do not interpret size bands. Current samples have no numeric dimensions or trade prices. Material options contain only recognised supplied values. Photo Frame pages relabel Colour/Material as Frame Colour/Frame Material, use the explicit Frame Material attribute, retain recognised Photo Size as Frame Size and expand Orientation Both to Portrait and Landscape. Aperture/handles/candle type/lantern suitability/bowl purpose/ornament subject require supplied attributes on relevant category pages. Coming soon maps to Due Soon / Incoming. Generic New Season is excluded as a coordinated range; supplied named collections can appear. Accessory clocks use a simple Type/Size/Colour/Material/Style/Availability model and do not import Thomas Kent data. Existing separate Clocks pages and all navigation are unchanged.


## Artbeat Cards filters — 1 October 2026
Greeting Cards uses an isolated Artbeat filter adapter and “Filter Artbeat Cards” sidebar heading. Occasion/Recipient/Theme/Pack Size/Finish/Availability precede supported Format/Colour/Style and Price. Options come only from the supplied sample records; no empty seasonal occasions or suggested example pack quantities are added. Pack Quantity 6 becomes Pack of 6; arbitrary valid actual trade quantities are retained. Blank maps to General / Everyday. Finish and Style require at least 80% field coverage within the category sample; supplied Uncoated is retained without relabelling as Matt. Current four Artbeat-named demo records support occasion, recipient, packs, finishes, stock and one recognised colour. Theme, real card formats and style are unavailable and hidden. Generic Small/Medium/Large and Natural colour placeholders are excluded. Price uses trade price only, never RRP; no width/height/depth controls exist. These remain demonstration records, not an approved Artbeat SKU export: verify trade packs and attributes before Magento deployment. No cards, menu destinations or other departments were changed.


## Made to Order filters — 1 October 2026
Made to Order filters are isolated from stocked Furniture. Primary order follows Product Type, mm Width/Height/Depth, Material, Colour / Finish, Style, Lead Time and Availability. Lead Time opens by default. No approved MTO product assignments exist in the prototype; headings show missing specification/production/order-status messages, with numeric controls disabled. No sample production bands, product types, status values or customisation choices were invented. Supplied productionLeadTimeBand/productionLeadTime/Lead Time values are preserved; explicit productionLeadTimeWeeks becomes an exact week value rather than an inferred band. Only Made to Order, Available to Order and Temporarily Unavailable statuses are recognised; In Stock is excluded. Shape/customisation/room/collection require actual product attributes. Generic New Season is not treated as a coordinated range. Mattress category omits unsupported upholstery material/colour/style headings. Swatch-only categories omit physical product dimensions unless explicitly supplied. Current navigation, mattress sample assignments, cards and other departments remain unchanged. Approved range records are required to demonstrate live MTO filter results.


## Clocks filters — 1 October 2026
Clocks uses the existing 14 Thomas Kent records as its benchmark. Product Type, Size / Width (one collapsible section containing explicit mm range controls and existing TK size bands), Colour, Style and Availability precede supported secondary attributes and Price. Wall, Mantel, Cuckoo, Outdoor and Alarm types remain sourced from records; Oversized membership comes only from the supplied Oversized band. No marketing-name or SKU-code dimensions are inferred. Current records lack numeric widths/diameters, materials and verified Gallery stock, so mm and stock sections show missing-data messages. Silent Sweep becomes Silent / Sweep; Audible Ticking is retained as a supplied movement value and is never assumed to mean Quartz. Movement requires at least 80% populated records within a category. Generic Number Dials is retained without inventing Arabic Numerals; explicit Roman Numerals remains available. Features only use dedicated recognised attributes; no description parsing. Exact widthMm/diameterMm and mm aliases are supported when supplied. Existing clock navigation, cards and data records remain unchanged.
