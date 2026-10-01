# Gallery Art proof of concept

20 real Gallery/Art Marketing Art products have replaced the illustrative Art records. All 20 products have an unsuffixed primary image and alternate images: 88 site-owned images in total (20 primary, 68 alternate). Variants retain numeric filename order. Web images retain their original proportions and use a maximum 1800-pixel edge.

The cleaned workbook has 244 Art rows. The ZIP has 158 images across 47 ImageKeys; 42 keys match the Art sheet. All imported ImageKeys match the final six barcode digits. The sample includes 15 canvases (including framed canvases and one pair) and five framed-art products.

## Data limitations

- ImageKey is the prototype product reference because the workbook does not supply a reliable SKU column. Barcodes, names, brand, range, product type, availability and RRP are retained.
- Three-number dimensions in product names are shown in their supplied order. Axis order is not uniformly confirmed, so individual width/height values and orientation are left blank.
- Subject is assigned only from explicit title words such as trees/birch, chimp and bay/marina/headland.
- Colour, frame colour/material, style, room and artist remain blank where unsupported. Marketing titles such as Blue Bay View do not establish a master artwork colour.
- Framed Canvas is mapped to the existing Canvas filter and Canvas Art route, while retaining its source type and framed flag. The explicit S/2 canvas retains Set of 2 and belongs to the existing Art Sets route.
- Range values are retained verbatim; they are not assumed to be curated coordinated collections. Availability is a workbook snapshot, not live stock.
- Only RRP ships in the public product data; trade prices retain the existing sign-in prompt. Costs, margins, MOQ, stock quantities and performance data are excluded.
- Menus, filter definitions, typography, spacing, cards and layouts are unchanged. Other department records and the 20 Mirrors records are unchanged. Six empty alternate Mirror image files from the previous conversion were repaired in place, without changing their product associations.

## Archive ImageKeys with no matching Art row

`048303`, `048310`, `054748`, `055356`, `057329`

These five keys are not imported. The remaining matched range stays outside this 20-product proof of concept.
