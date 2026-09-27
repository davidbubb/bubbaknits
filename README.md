# Bubbaknits

A first-pass static website concept for showcasing knitted children's clothes and toys.

## Structure

- `/index.html` – welcoming home page with featured products
- `/category.html` – reusable category page driven by the query string
- `/data/products.json` – editable product catalogue
- `/assets/images/` – local placeholder artwork for products

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