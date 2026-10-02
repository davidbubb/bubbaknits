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

  const currentPage = document.body.dataset.page;
  const aboutItem = document.createElement("li");
  const aboutLink = document.createElement("a");

  aboutLink.href = "./about.html";
  aboutLink.textContent = "About";

  if (currentPage === "about") {
    aboutLink.setAttribute("aria-current", "page");
  }

  aboutItem.append(aboutLink);

  const items = categories.map((category) => {
    const item = document.createElement("li");
    const link = document.createElement("a");

    link.href = `./category.html?category=${encodeURIComponent(category.slug)}`;
    link.textContent = category.name;
    item.append(link);

    return item;
  });

  items.unshift(aboutItem);

  const contactItem = document.createElement("li");
  const contactLink = document.createElement("a");

  contactLink.href = "./contact.html";
  contactLink.textContent = "Contact";

  if (currentPage === "contact") {
    contactLink.setAttribute("aria-current", "page");
  }

  contactItem.append(contactLink);
  items.push(contactItem);

  const termsItem = document.createElement("li");
  const termsLink = document.createElement("a");

  termsLink.href = "./terms.html";
  termsLink.textContent = "Terms";

  if (currentPage === "terms") {
    termsLink.setAttribute("aria-current", "page");
  }

  termsItem.append(termsLink);
  items.push(termsItem);

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
  image.loading = "lazy";
  title.textContent = product.name;
  price.textContent = formatPrice(product.price);

  meta.append(title, price);

  if (typeof product.stock === "number" && product.stock <= 2) {
    const badge = document.createElement("p");

    badge.className = "product-stock";
    badge.textContent =
      product.stock === 0 ? "Made to order" : `Only ${product.stock} left in stock`;

    meta.append(badge);
  }

  if (product.leadTime) {
    const note = document.createElement("p");

    note.className = "product-note";
    note.textContent = product.leadTime;

    meta.append(note);
  }

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

const buildCategories = (products, configuredCategories = []) => {
  const categories = new Map();

  configuredCategories.forEach((name) => {
    const slug = slugify(name);
    categories.set(slug, { name, slug, count: 0 });
  });

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

const loadCatalog = async () => {
  const response = await fetch(DATA_PATH);

  if (!response.ok) {
    throw new Error("Unable to load product data");
  }

  const payload = await response.json();
  const configuredCategories = Array.isArray(payload) ? [] : payload.categories || [];
  const products = (Array.isArray(payload) ? payload : payload.products || []).map((product) => ({
    ...product,
    categorySlugs: product.categories.map((category) => slugify(category)),
  }));

  return { configuredCategories, products };
};

const renderHomePage = (products, categories) => {
  const featuredGrid = document.querySelector("#featured-grid");
  const categoryGrid = document.querySelector("#shop-categories");

  if (featuredGrid) {
    const featuredCards = products
      .filter((product) => product.featured)
      .map(createProductCard);

    featuredGrid.replaceChildren(
      ...(featuredCards.length
        ? featuredCards
        : [
            createMessageCard(
              "Featured products coming soon",
              "Mark products as featured in the catalogue data to highlight them here.",
            ),
          ]),
    );
    setBusyState(featuredGrid, false);
  }

  if (categoryGrid) {
    const cards = categories.map((category) => createCategoryCard(category));

    categoryGrid.replaceChildren(
      ...(cards.length
        ? cards
        : [
            createMessageCard(
              "Categories coming soon",
              "Add categories in the catalogue data to show navigation here.",
            ),
          ]),
    );
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
  grid.hidden = filteredProducts.length === 0;
  empty.hidden = filteredProducts.length > 0;

  if (filteredProducts.length === 0) {
    const heading = empty.querySelector("h2");
    const copy = empty.querySelector("p");

    if (heading) {
      heading.textContent = "Products coming soon";
    }

    if (copy) {
      copy.textContent =
        "This category is ready for new additions as the catalogue grows.";
    }
  }

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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const setFormStatus = (status, message, isError) => {
  if (!status) {
    return;
  }

  status.hidden = false;
  status.textContent = message;
  status.classList.toggle("form-status-error", isError);
  status.classList.toggle("form-status-success", !isError);
};

const initContactForm = () => {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#contact-status");

  if (!form) {
    return;
  }

  const fields = [
    {
      input: document.querySelector("#contact-name"),
      error: document.querySelector("#contact-name-error"),
      isValid: (value) => value.trim().length > 0,
    },
    {
      input: document.querySelector("#contact-email"),
      error: document.querySelector("#contact-email-error"),
      isValid: (value) => EMAIL_PATTERN.test(value.trim()),
    },
    {
      input: document.querySelector("#contact-message"),
      error: document.querySelector("#contact-message-error"),
      isValid: (value) => value.trim().length > 0,
    },
  ].filter((field) => field.input && field.error);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const isValid = fields.reduce((allValid, { input, error, isValid: check }) => {
      const fieldValid = check(input.value);

      error.hidden = fieldValid;
      input.setAttribute("aria-invalid", String(!fieldValid));

      return allValid && fieldValid;
    }, true);

    if (!isValid) {
      setFormStatus(status, "Please fix the highlighted fields and try again.", true);
      return;
    }

    const accessKey = form.querySelector('input[name="access_key"]');

    if (!accessKey || !accessKey.value || accessKey.value === "YOUR_WEB3FORMS_ACCESS_KEY") {
      setFormStatus(
        status,
        "This form isn't configured yet. Please email us directly at hello@bubbaknits.com instead.",
        true,
      );
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
    }

    setFormStatus(status, "Sending your message…", false);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Message could not be sent");
      }

      form.reset();
      setFormStatus(
        status,
        "Thank you! Your message has been sent — we'll reply within 2 business days.",
        false,
      );
    } catch (error) {
      console.error(error);
      setFormStatus(
        status,
        "Sorry, your message couldn't be sent just now. Please email us directly at hello@bubbaknits.com.",
        true,
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
};

const init = async () => {
  const page = document.body.dataset.page;

  if (page === "contact") {
    initContactForm();
  }

  try {
    const { configuredCategories, products } = await loadCatalog();
    const categories = buildCategories(products, configuredCategories);

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
