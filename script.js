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
const p = document.querySelector('.total-price');

const sum = () => {
  const li = document.querySelectorAll('.cart__item');
  let totalPrice = 0;
  li.forEach((item) => {
    const string = item.innerText;
    const price = Number(string.split('$')[1]);
    totalPrice += price;
  });
  p.innerText = totalPrice;
};

const attLocalStorage = () => {
  localStorage.setItem('storage', ol.innerHTML);
};

function cartItemClickListener(event) {
  ol.removeChild(event.target);
  sum();
  attLocalStorage();
}

const cartList = () => {
  ol.innerHTML = localStorage.getItem('storage');
  sum();
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  ol.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  attLocalStorage();
  sum();
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
    sum();
  });
};
 
  fetchAPI();
  cartList();
  clearCart();
