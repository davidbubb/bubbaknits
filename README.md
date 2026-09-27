# Bubbaknits

A first-pass static website concept for showcasing knitted children's clothes and toys.

## Structure

- `/index.html` – welcoming home page with featured products
- `/category.html` – reusable category page driven by the query string
- `/data/products.json` – editable product catalogue
- `/assets/images/` – local placeholder artwork for products

## Managing products

Update `/data/products.json` to change the catalogue. Each product entry includes:

- `name`
- `price`
- `image`
- `categories`
- `featured`

Categories are generated automatically from the product data and used for navigation and category pages.