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

const ol = document.querySelector('.cart__items');

const attLocalStorage = () => {
  // locarStorage.setItem('chave', 'valor') para criar chave valor
  // localStorage.getItem('chave') para acessar chave valor
  // localStorage.removeItem('chave') para remover chave valor
  // localStorage.clear() para limpar o localStorage
  localStorage.setItem('storage', ol.innerHTML);
};

function cartItemClickListener() {
  const li = document.querySelector('.cart__item');
  ol.removeChild(li);
  attLocalStorage();
}

const cartList = () => {
  ol.innerHTML = localStorage.getItem('storage');
  const productsList = document.querySelectorAll('.cart__item');
  console.log(productsList);
  productsList.forEach((product) => product.addEventListener('click', cartItemClickListener));
};

const sum = (price) => {
  // const cart = document.querySelector('.cart');
  // const p = document.createElement('p');
  // cart.appendChild(p);
  // p.className = 'total-price';
  // p.innerText = price;
  console.log(price);
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  ol.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  attLocalStorage();
  sum(salePrice);
  return li;
}

const addItemToCart = (event) => {
  const clickId = event.target.parentElement.firstElementChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${clickId}`)
  .then((response) => response.json())
  .then((item) => createCartItemElement(item));
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addItemToCart);

  return section;
}

const appendItem = (products) => {
  const item = document.getElementsByClassName('items');
  products.forEach((product) => item[0].appendChild(createProductItemElement(product)));
};

const fetchAPI = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
  .then((response) => response.json())
  .then(({ results }) => appendItem(results));
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const clearCart = () => {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    localStorage.clear();
    ol.innerText = '';
  });
};

window.onload = function onload() { 
  fetchAPI();
  cartList();
  clearCart();
};
