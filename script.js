const itemsList = document.querySelector('.items');
const emptyCart = document.querySelector('.empty-cart');
const totalPrice = document.querySelector('.total-price');
let total = 0;
const cartItems = document.querySelector('.cart__items');
let cartIds = [];

const saveCart = (id) => {
  const index = cartIds.indexOf(id);
  if (index > -1) {
    cartIds.splice(index, 1);
  }
  if (!cartIds) {
    localStorage.clear();
  }
  localStorage.setItem('cartStorage', cartIds);
  localStorage.setItem('total', total);
};

const saveIds = (id) => {
  cartIds.push(id);
};

function cartItemClickListener(event) {
  event.target.remove();
  saveCart(event.target.id);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const subtractTotal = (price) => {
  total -= price;
  totalPrice.innerHTML = total;
};

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = id;
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', () => subtractTotal(price));
  li.addEventListener('click', cartItemClickListener);
  total += price;
  totalPrice.innerHTML = total;
  return li;
}

const addProduct = (id) => new Promise((resolve, reject) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((result) => result.json())
  .then((resultJson) => resolve(cartItems.appendChild(createCartItemElement(resultJson))))
  .then(() => saveCart())
  .catch((err) => reject(err));
});

const addToCart = (evt) => {
const item = evt.target.parentElement;
const id = getSkuFromProductItem(item);
saveIds(id);
addProduct(id);
};

const loadCart = () => {
  if (!localStorage.length) { 
    cartItems.innerHTML = ''; 
    return;
  }
  const ids = localStorage.getItem('cartStorage').split(',');
  cartIds = ids;
  ids.forEach((product) => addProduct(product));
  console.log(ids);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

emptyCart.addEventListener('click', () => {
  cartItems.innerHTML = '';
  total = 0;
  totalPrice.innerHTML = '';
  localStorage.clear();
});

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', addToCart);
  }
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
  itemsList.innerHTML = '<span class="loading">loading...<span/>';
  loadCart();
  const products = await getProduct('computador');
  itemsList.innerHTML = '';
  return products.forEach((product) => itemsList.appendChild(createProductItemElement(product)));
};
