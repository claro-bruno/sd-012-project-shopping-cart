function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const createProductsList = async () => {
  const itemsSection = document.querySelector('.items');
  const API_LINK = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const apiFetch = await fetch(API_LINK);
  const promiseJson = await apiFetch.json();
  const productList = promiseJson.results;
  productList.forEach((product) => {
    const productElement = createProductItemElement(product);
    itemsSection.appendChild(productElement);
  });
};

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(event) {
  localStorage.removeItem(event.target.innerHTML);
  const cart = event.target.parentNode;
  cart.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const productBySku = async (sku) => {
  const API_LINK = `https://api.mercadolibre.com/items/${sku}`;
  const apiFetch = await fetch(API_LINK);
  return apiFetch.json();
};

const savedItems = () => {
  const cartItems = document.querySelector('.cart__items');
  const localKeys = Object.keys(localStorage);
  localKeys.forEach((key) => {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = key;
    cartItems.appendChild(li);
    li.addEventListener('click', cartItemClickListener);
  });
};

const addCartItem = () => {
  const productsButtons = document.querySelectorAll('.item__add');
  const cartItems = document.querySelector('.cart__items');
  productsButtons.forEach((button, index) => {
    button.addEventListener('click', async () => {
      const sku = button.parentNode.firstChild.innerText;
      const productObj = await productBySku(sku);
      const elemento = createCartItemElement(productObj);
      cartItems.appendChild(elemento);
      localStorage.setItem(elemento.innerHTML, index);
    });
  });
};

window.onload = async () => {
  await createProductsList();
  savedItems();
  addCartItem();
};