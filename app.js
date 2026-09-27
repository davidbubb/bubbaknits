const DATA_PATH = "./data/products.json";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const formatPrice = (value) => `£${Number(value).toFixed(2)}`;

const setBusyState = (element, isBusy) => {
  if (element) {
    element.setAttribute("aria-busy", String(isBusy));
  }
};

const createMessageCard = (title, message) => {
  const card = document.createElement("div");
  const heading = document.createElement("h2");
  const copy = document.createElement("p");

  card.className = "empty-state";
  heading.textContent = title;
  copy.textContent = message;

  card.append(heading, copy);

  return card;
};

const renderNav = (categories) => {
  const nav = document.querySelector("#site-nav");

  if (!nav) {
    return;
  }

  const items = categories.map((category) => {
    const item = document.createElement("li");
    const link = document.createElement("a");

    link.href = `./category.html?category=${encodeURIComponent(category.slug)}`;
    link.textContent = category.name;
    item.append(link);

    return item;
  });

  nav.replaceChildren(...items);
};

const createProductCard = (product) => {
  const card = document.createElement("article");
  const image = document.createElement("img");
  const meta = document.createElement("div");
  const title = document.createElement("h3");
  const price = document.createElement("p");

  card.className = "product-card";
  meta.className = "product-meta";
  price.className = "product-price";

  image.src = product.image;
  image.alt = product.name;
  title.textContent = product.name;
  price.textContent = formatPrice(product.price);

  meta.append(title, price);
  card.append(image, meta);

  return card;
};

const createCategoryCard = (category) => {
  const card = document.createElement("a");
  const body = document.createElement("div");
  const badge = document.createElement("span");
  const title = document.createElement("h3");
  const copy = document.createElement("p");

  card.className = "category-card";
  body.className = "category-card-body";
  badge.className = "category-badge";

  card.href = `./category.html?category=${encodeURIComponent(category.slug)}`;
  badge.textContent = `${category.count} item${category.count === 1 ? "" : "s"}`;
  title.textContent = category.name;
  copy.textContent = "View this collection.";

  body.append(badge, title, copy);
  card.append(body);

  return card;
};

const buildCategories = (products) => {
  const categories = new Map();

  products.forEach((product) => {
    product.categories.forEach((name, index) => {
      const slug = product.categorySlugs[index];
      const existing = categories.get(slug);

      if (existing) {
        existing.count += 1;
        return;
      }

      categories.set(slug, { name, slug, count: 1 });
    });
  });

  return [...categories.values()];
};

const loadProducts = async () => {
  const response = await fetch(DATA_PATH);

  if (!response.ok) {
    throw new Error("Unable to load product data");
  }

  const products = await response.json();

  return products.map((product) => ({
    ...product,
    categorySlugs: product.categories.map((category) => slugify(category)),
  }));
};

const renderHomePage = (products, categories) => {
  const featuredGrid = document.querySelector("#featured-grid");
  const categoryGrid = document.querySelector("#shop-categories");

  if (featuredGrid) {
    const featuredCards = products
      .filter((product) => product.featured)
      .map(createProductCard);

    featuredGrid.replaceChildren(...featuredCards);
    setBusyState(featuredGrid, false);
  }

  if (categoryGrid) {
    const cards = categories.map((category) => createCategoryCard(category));

    categoryGrid.replaceChildren(...cards);
    setBusyState(categoryGrid, false);
  }
};

const renderCategoryPage = (products, categories) => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("category");
  const title = document.querySelector("#category-title");
  const summary = document.querySelector("#category-summary");
  const grid = document.querySelector("#category-grid");
  const empty = document.querySelector("#category-empty");

  if (!slug || !title || !summary || !grid || !empty) {
    return;
  }

  const category = categories.find((entry) => entry.slug === slug);

  if (!category) {
    title.textContent = "Categories";
    summary.textContent = "The requested collection could not be found.";
    empty.hidden = false;
    grid.hidden = true;
    grid.replaceChildren();
    document.title = "Bubbaknits | Categories";
    setBusyState(grid, false);
    return;
  }

  const filteredProducts = products.filter((product) => product.categorySlugs.includes(slug));

  title.textContent = category.name;
  summary.textContent = `Discover hand-knitted pieces and gift ideas in the ${category.name} collection.`;
  grid.replaceChildren(...filteredProducts.map(createProductCard));
  grid.hidden = false;
  empty.hidden = true;
  document.title = `Bubbaknits | ${category.name}`;
  setBusyState(grid, false);
};

const renderLoadError = () => {
  const page = document.body.dataset.page;

  if (page === "home") {
    const featuredGrid = document.querySelector("#featured-grid");
    const categoryGrid = document.querySelector("#shop-categories");
    const message = createMessageCard(
      "Catalogue unavailable",
      "We couldn't load the product catalogue just now. Please try again shortly.",
    );

    if (featuredGrid) {
      featuredGrid.replaceChildren(message);
      setBusyState(featuredGrid, false);
    }

    if (categoryGrid) {
      categoryGrid.replaceChildren(
        createMessageCard(
          "Categories unavailable",
          "Category links will appear here once the catalogue loads correctly.",
        ),
      );
      setBusyState(categoryGrid, false);
    }
  }

  if (page === "category") {
    const title = document.querySelector("#category-title");
    const summary = document.querySelector("#category-summary");
    const grid = document.querySelector("#category-grid");
    const empty = document.querySelector("#category-empty");

    if (title) {
      title.textContent = "Catalogue unavailable";
    }

    if (summary) {
      summary.textContent =
        "We couldn't load the collection right now. Please try again shortly.";
    }

    if (grid) {
      grid.hidden = true;
      grid.replaceChildren();
      setBusyState(grid, false);
    }

    if (empty) {
      empty.hidden = false;
      const heading = empty.querySelector("h2");
      const copy = empty.querySelector("p");

      if (heading) {
        heading.textContent = "Products unavailable";
      }

      if (copy) {
        copy.textContent =
          "The product catalogue could not be loaded for this page.";
      }
    }
  }
};

const init = async () => {
  try {
    const products = await loadProducts();
    const categories = buildCategories(products);
    const page = document.body.dataset.page;

    renderNav(categories);

    if (page === "home") {
      renderHomePage(products, categories);
    }

    if (page === "category") {
      renderCategoryPage(products, categories);
    }
  } catch (error) {
    console.error(error);
    renderLoadError();
  }
};

init();
