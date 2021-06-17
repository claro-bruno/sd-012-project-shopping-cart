function getCart() {
  return (document.querySelector('.cart__items'));
}

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

function sumPrices() {
  const cartElements = Array.from(document.getElementsByClassName('cart__item'));
  const productsText = [];
  const productPrices = [];
  let totalPrice = 0;
  cartElements.forEach((element) =>
    productsText.push(element.innerText));
  productsText.forEach((element) =>
    productPrices.push(parseFloat(element.split('$')[1])));
  totalPrice = productPrices.reduce((a, b) => (parseFloat(a) + parseFloat(b)), 0);
  
  document.querySelector('.total-price')
  .innerText = totalPrice;
}

function cartItemClickListener(li, id) {
  li.remove();
  localStorage.removeItem(id);
  sumPrices();
}

function storeItem(id) {
  const itemKeys = Object.keys(localStorage);
  let newKey = id;
  itemKeys.forEach((key) => {
    if (newKey === key) {
      newKey += ('+'); 
    }
  });
  localStorage.setItem(newKey, id);
  return newKey;
}

function createStoredItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', () => { cartItemClickListener(li, id); });
  return li;
}

async function loadStoredItem(id) {
  try {
    await fetch(`https://api.mercadolibre.com/items/${id}`).then((response) => {
      response.json().then((product) => {
        getCart().appendChild(createStoredItemElement(product));
      });
    });
  } catch (error) {
    console.log(error);
  }
 }

 function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  const storageKey = storeItem(id);
  li.addEventListener('click', () => { cartItemClickListener(li, storageKey); });
  return li;
}

async function getClickedItem(id) {
  try {
    await fetch(`https://api.mercadolibre.com/items/${id}`).then((response) => {
      response.json().then((product) => {
        getCart().appendChild(createCartItemElement(product));
        sumPrices();
      });
    });
  } catch (error) {
    console.log(error);
  }
 }

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getProducts = ((searchTerm) => new Promise((resolve, reject) => {
  if (searchTerm === 'computador') {
    const items = document.querySelector('.items');
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`).then((response) => {
      response.json().then((products) => {
        products.results.forEach((product) => {
          items.appendChild(createProductItemElement(product)).querySelector('.item__add')
          .addEventListener('click', () => (getClickedItem(product.id)));
        });
        resolve(products.results);
      });
    });
  } else {
    return reject(new Error('Produto não aceito!'));
  }
}));

const fetchProducts = async () => {
  try {
    await getProducts('computador');
  } catch (error) {
    console.log(error);
  }
};

function loadCart() {
  if (localStorage.length > 0) {
    const itemKeys = Object.keys(localStorage);
    itemKeys.forEach((key) => {
      loadStoredItem(localStorage.getItem(key));
    });
  }
}

function emptyCart() {
  const items = document.querySelector('.cart__items');
  while (items.firstChild) {
    items.removeChild(items.lastChild);
  }
  localStorage.clear();
  sumPrices();
}

window.onload = function onload() {
  document.querySelector('.empty-cart').addEventListener('click', () => { emptyCart(); });
  loadCart();
  fetchProducts();
};
