# Bubbaknits

A first-pass static website concept for showcasing knitted children's clothes and toys.

## Structure

- `/index.html` – welcoming home page with featured products
- `/category.html` – reusable category page driven by the query string
- `/about.html` – brand story page, currently filled with sample text to replace
- `/contact.html` – contact details and a contact form
- `/terms.html` – pricing, privacy, returns and delivery terms
- `/404.html` – themed not-found page for broken or missing links
- `/data/products.json` – editable product catalogue
- `/assets/images/` – local placeholder artwork for products and the favicon
- `/design/` – original design source files (PSD, high-res logo), excluded from the deployed site

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

The contact form on `/contact.html` validates fields in the browser, then
posts to [Web3Forms](https://web3forms.com) — a free form backend (250
submissions per month on the free tier) that emails submissions to you without
needing your own server. If JavaScript is unavailable, the form posts directly
to the same endpoint.

To activate it:

1. Visit <https://web3forms.com>, enter the email address that should receive
   enquiries (e.g. `hello@bubbaknits.com`) and copy the access key they send.
2. Paste the key into the hidden `access_key` input at the top of the form in
   `contact.html`.
3. Commit and push — submissions will arrive by email, with no email client
   needed on the visitor's side.

Until the key is configured the form shows a friendly fallback message
pointing visitors at the email address instead. [Formspree](https://formspree.io)
is a good alternative (50 submissions per month free) if you prefer.

## Managing products

Update `/data/products.json` to change the catalogue. The file can define:

- `categories` – the category pages/navigation you want available
- `products` – the catalogue entries to display

Each product entry includes:

- `name`
- `price`
- `image`
- `categories`
- `featured`

Optional fields that enrich the product cards:

- `description` – short summary shown on future product pages
- `materials` – e.g. `100% merino wool`
- `care` – washing/care instructions
- `sizes` – list of available sizes (omit for one-size items like toys)
- `stock` – items with 1–2 in stock show an "Only N left" badge; `0` shows
  "Made to order"
- `leadTime` – delivery note shown under the price, e.g. `Made to order in
  2–3 weeks`

Category navigation and category pages are driven by the JSON file, with product counts calculated from the current product assignments.