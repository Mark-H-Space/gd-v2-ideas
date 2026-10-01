# Gallery Direct Version B — GitHub source package

This is the current Nigel / Version B static website, exported on 1 October 2026.
Source commit: 807bd26b41899b163fd3acc2d47943ecac24f69a.
Version A and the live websites are unchanged by this export.

## What is included

- `dist/`: the complete browser website, including HTML, CSS, JavaScript, catalogue data and all locally stored images.
- `scripts/`: the existing catalogue import and navigation generation helpers.
- `checks/`: the existing development checks and import reports.
- Root JSON and Markdown files: taxonomy, image manifests and developer handover notes.

The latest changes are included: standalone Art, Mirrors and Clocks navigation; completed Art filters; only the first filter dropdown open by default; cleaned Art titles; removal of the PDP quick-specifications block.

## Put it into GitHub

Unzip `Gallery-Direct-Version-B-GitHub.zip`. Upload or commit the **contents** of the `gallery-direct-version-b` folder, preserving its folders. Uploading the ZIP itself stores an archive rather than editable website files.

For the complete package, use GitHub Desktop or Git. This avoids the browser's 100-files-per-upload limit.

### Using an existing local clone

1. Clone your chosen GitHub repository to your Mac using GitHub Desktop or Git.
2. Copy the exported folder contents into that local repository. Keep `dist`, `scripts` and `checks` intact.
3. Review the changes, commit them with the message `Add Gallery Direct Version B prototype`, and push to GitHub.

Or, in Terminal from your cloned repository after copying the files:

```sh
git add .
git commit -m "Add Gallery Direct Version B prototype"
git push
```

### Using GitHub's website

Choose **Add file → Upload files** in the destination repository. Upload the extracted files and folders in batches of up to 100 files, maintaining their paths, and commit each batch. The package has more than 100 files, so a single browser upload will not take the whole site.

GitHub documentation: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

## Run the website locally

From the exported folder in Terminal:

```sh
python3 -m http.server 8000 --directory dist
```

Visit http://localhost:8000/ . No npm install or build is required.

For another static host, serve `dist` as the public directory. Adding code to a GitHub repository alone does not publish a website.

## Main files to edit

- Homepage: `dist/index.html`
- Shared category listing: `dist/catalogue.html`
- Mirrors listing: `dist/mirrors.html`
- Product details: `dist/product.html`
- Interactions, galleries and filter rendering: `dist/preview.js`
- Version B Art / Mirrors / Clocks / Cards filters: `dist/version-b-filters.js`
- Version B menu routes: `dist/version-b-mega-routes.js`
- Catalogue products: `dist/catalogue-data.js`
- Mirror products: `dist/mirror-data.js`
- Shared styles: `dist/preview.css`, `dist/gallery-theme.css`, `dist/gallery-page-theme.css`
- Version B mega-menu style: `dist/version-b-menus.css`

Art filter enrichment is scoped to `version-b-filters.js`; it deliberately does not alter the underlying PDP product data. Unknown Style, Artist, Frame Material and Room values remain unassigned. Existing HTML pages contain the shared menu markup.

## Prototype scope

This is editable HTML/CSS/JavaScript, not an installable Magento 2 theme. The Magento handover describes how a developer should adapt it to the live theme and catalogue.

Mirrors and Art use imported Gallery sample data and images. Lighting uses real supplied images with explicitly illustrative product specifications. Other prototype records may also be samples. Trade account, basket and project-board interactions are demonstrations, not connected production services; project boards persist locally on the visitor's device.

Local assets are included. Some homepage/editorial and Thomas Kent images, fonts or other resources still use external URLs already referenced by the prototype. Internet access is needed for those resources.

Repository credentials, Git history, original workbook/ZIP uploads and the ChatGPT Sites project binding are excluded. The export does not connect your GitHub repository back to the hosted preview or change its deployment settings.

Some older helper scripts and reports document earlier imports or menu states. Running a generator or importer can replace current files; review its inputs and resulting diff before using it. The exported `dist` folder is the current authoritative website snapshot.
