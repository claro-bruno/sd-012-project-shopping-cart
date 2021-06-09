const itemsList = document.querySelector('.items');
const emptyCart = document.querySelector('.empty-cart');
// const cart = document.querySelector('.cart');
const cartItems = document.querySelector('.cart__items');

emptyCart.addEventListener('click', () => {
  cartItems.innerHTML = '';
});

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addToCart = (evt) => {
  const item = evt.target.parentElement;
  const id = getSkuFromProductItem(item);
  return new Promise((resolve, reject) => {
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((result) => result.json())
    .then((resultJson) => cartItems.appendChild(createCartItemElement(resultJson)))
    .catch((err) => reject(err));
  });
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') { e.addEventListener('click', addToCart); }
  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getProduct = (search) => new Promise((resolve, reject) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${search}`;
  fetch(url)
  .then((result) => result.json())
  .then((resultJson) => resolve(resultJson.results))
  .catch((err) => reject(err));
});

window.onload = async () => {
  const products = await getProduct('computador');
  // const productsArray = Object.values(products);
  return products.forEach((product) => itemsList.appendChild(createProductItemElement(product)));
};
