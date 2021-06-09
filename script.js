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

const addCartItem = () => {
  const productsButtons = document.querySelectorAll('.item__add');
  const cartItems = document.querySelector('.cart__items');
  productsButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const sku = button.parentNode.firstChild.innerText;
      const API_LINK = `https://api.mercadolibre.com/items/${sku}`;
      const apiFetch = await fetch(API_LINK);
      const productObj = await apiFetch.json();
      cartItems.appendChild(createCartItemElement(productObj));
    });
  });
};

window.onload = async function onload() {
  await createProductsList();
  addCartItem();
};