# Bubbaknits

A static website for showcasing hand-knitted children's clothes and accessories.

## Structure

- `/index.html` – welcoming home page with featured products
- `/category.html` – reusable category page driven by the query string
- `/product.html` – reusable product page with a photo gallery
- `/about.html` – information about the maker and the handmade collection
- `/contact.html` – contact details and a contact form
- `/terms.html` – pricing, privacy, returns and delivery terms
- `/404.html` – themed not-found page for broken or missing links
- `/data/products.json` – editable product catalogue
- `/assets/images/` – product photographs, brand images and the favicon
- `/design/` – original design source files (PSD, high-res logo), excluded from the deployed site

## Running locally

The site is static and has no project dependencies to install. Because the
catalogue is loaded from a JSON file, serve the repository over HTTP rather
than opening `index.html` directly.

In VS Code:

1. Install the **Live Server** extension by Ritwick Dey.
2. Open this repository's `index.html`.
3. Click **Go Live** in the VS Code status bar. The site opens in your browser.
4. Click **Port: 5500** in the status bar to stop the server.

Alternatively, if Node.js is installed, run `npx --yes http-server` from the
repository root and open the local URL shown in the terminal. The first run
may download the small server package.

## Deploying to GitHub Pages

The workflow in `.github/workflows/pages.yml` publishes the site from the
repository root whenever changes are pushed to `main`, or when run manually
from the Actions tab. To enable it, open the repository's **Settings → Pages**
and set **Build and deployment → Source** to **GitHub Actions**. Then commit and
push the site and workflow changes to `main` and wait for the Pages workflow to
finish.

The expected site URL is <https://davidbubb.github.io/bubbaknits/>. The
repository must be public for anyone to view the site unless its GitHub plan
supports Pages for private repositories.

## Contact form

The contact form on `/contact.html` validates fields in the browser and
submits enquiries through [Web3Forms](https://web3forms.com). Its access key is
stored in the form's hidden `access_key` input. If you change the receiving
account, replace the key with the one issued for that account. If JavaScript
is unavailable, the form posts directly to the same endpoint.

## Managing products

Update `/data/products.json` to change the catalogue. The file can define:

- `heroFeature` – controls the homepage hero product
- `categories` – the category pages/navigation you want available
- `products` – the catalogue entries to display

Set `heroFeature.mode` to `"preset"` and `heroFeature.product` to a product
slug (for example, `"cream-jumper-12-18-months"`) to choose the homepage hero
item. Set the mode to `"random"` to choose a different product marked
`"featured": true` on each page load. If no products are marked featured, all
products are eligible for random selection. The featured product cards below
the hero remain controlled by each product's `featured` value.

Each product entry includes:

- `name`
- `price`
- `image`
- `gallery` – additional photos for the product detail page
- `categories`
- `featured`

Product cards link to a detail page that lets visitors browse the product's
main image and every photo listed in its `gallery`. Add gallery paths relative
to the repository root (using the same `./assets/images/...` format as `image`).

Use `priceLabel` when a product has a price range; `price` should contain its
starting price for catalogue data that expects a number.

Optional catalogue fields:

- `description` – short summary shown on the product detail page
- `stock` – items with 1–2 in stock show an "Only N left" badge; `0` shows
  "Made to order"
- `leadTime` – delivery note shown under the price

Category navigation and category pages are driven by the JSON file, with product counts calculated from the current product assignments.