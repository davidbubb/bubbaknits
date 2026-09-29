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
submits via a `mailto:` action so it works without a backend. Replace
`hello@bubbaknits.com` in `contact.html` and the site footers with a real
address, and consider swapping the form for a hosted service (e.g. Formspree
or Netlify Forms) before launch so submissions don't rely on the visitor's
email client.

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

Category navigation and category pages are driven by the JSON file, with product counts calculated from the current product assignments.