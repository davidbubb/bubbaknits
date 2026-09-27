const DATA_PATH = "./data/products.json";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const formatPrice = (value) => `£${Number(value).toFixed(2)}`;

const renderNav = (categories) => {
  const nav = document.querySelector("#site-nav");

  if (!nav) {
    return;
  }

  nav.innerHTML = categories
    .map(
      (category) =>
        `<li><a href="./category.html?category=${category.slug}">${category.name}</a></li>`,
    )
    .join("");
};

const productCard = (product) => `
  <article class="product-card">
    <img src="${product.image}" alt="${product.name}" />
    <div class="product-meta">
      <h3>${product.name}</h3>
      <p class="product-price">${formatPrice(product.price)}</p>
    </div>
  </article>
`;

const categoryCard = (category, count) => `
  <a class="category-card" href="./category.html?category=${category.slug}">
    <div class="category-card-body">
      <span class="category-badge">${count} item${count === 1 ? "" : "s"}</span>
      <h3>${category.name}</h3>
      <p>Browse the ${category.name.toLowerCase()} collection.</p>
    </div>
  </a>
`;

const buildCategories = (products) => {
  const names = [...new Set(products.flatMap((product) => product.categories))];

  return names.map((name) => ({ name, slug: slugify(name) }));
};

const loadProducts = async () => {
  const response = await fetch(DATA_PATH);

  if (!response.ok) {
    throw new Error("Unable to load product data");
  }

  return response.json();
};

const renderHomePage = (products, categories) => {
  const featuredGrid = document.querySelector("#featured-grid");
  const categoryGrid = document.querySelector("#shop-categories");

  if (featuredGrid) {
    featuredGrid.innerHTML = products
      .filter((product) => product.featured)
      .map(productCard)
      .join("");
  }

  if (categoryGrid) {
    categoryGrid.innerHTML = categories
      .map((category) => {
        const count = products.filter((product) =>
          product.categories.some((name) => slugify(name) === category.slug),
        ).length;

        return categoryCard(category, count);
      })
      .join("");
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
    grid.innerHTML = "";
    document.title = "Bubbaknits | Categories";
    return;
  }

  const filteredProducts = products.filter((product) =>
    product.categories.some((name) => slugify(name) === slug),
  );

  title.textContent = category.name;
  summary.textContent = `Discover hand-knitted ${category.name.toLowerCase()} pieces and gift ideas.`;
  grid.innerHTML = filteredProducts.map(productCard).join("");
  document.title = `Bubbaknits | ${category.name}`;
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
  }
};

init();
