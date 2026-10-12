# Inventor AI CAD Studio — GitHub Pages frontend

This is a standalone static HTML/CSS/JavaScript **planning interface**, derived from the Inventor AI CAD Studio prototype.

## Publish on GitHub Pages
1. Create a public GitHub repository (for example, `inventor-ai-cad-studio`).
2. Upload the three files `index.html`, `styles.css`, `app.js` to the **repository root** (this README is optional).
3. Open **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Select **main**, folder **/(root)**, then **Save**.
5. Once GitHub finishes deploying, open `https://YOUR-USERNAME.github.io/inventor-ai-cad-studio/`.

## What works
- Enter natural-language model descriptions, desired formats, materials, standards, and units.
- Select STEP/IPT/IAM files and configure desired drawing options.
- Save request configurations to browser `localStorage`.
- Download a JSON request manifest to supply to a future processing service.

## What is not implemented on GitHub Pages
- No actual 3D CAD or drawing generation; the pictured part is a **static illustration**.
- CAD upload only reads **filename/size metadata**; it does not upload or analyze the geometry.
- No STEP, IPT, IAM, IDW, DWG, or PDF output is created.
- Browser storage does not hold your CAD file; re-select it if you later submit it to a processing server.

## How to enable real Inventor generation later
Deploy a secure backend separately (e.g. Windows server with Inventor or Autodesk Platform Services Design Automation), with protected credentials and a job queue. The backend must interpret/validate requests, process CAD binaries, generate model geometry, check dimensions, store downloadable outputs, and integrate via HTTPS API. GitHub Pages cannot execute Inventor, Python web servers, or protect Autodesk API credentials. Do **not** embed API secrets in this HTML or JavaScript.

For Inventor drawings, critical tolerances, GD&T, datum choices, and manufacturing sufficiency still require engineering review.
