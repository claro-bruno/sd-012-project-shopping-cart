const ol = document.querySelector('.cart__items');
const total = document.querySelector('.total-price');
total.innerHTML = 0;

const totalPrice = () => {
  const prices = ol.childNodes;
  let result = 0;
  const regExp = /\d*\.?\d*$/;
  prices.forEach((price) => {
    result += parseFloat(price.innerHTML.match(regExp));
  });
  total.innerHTML = result;
};

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
   ol.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchProductList = async () => {
  const itens = document.querySelector('.items');
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const obj = await response.json();
  const arr = obj.results;
  return arr.forEach((computer) => itens.appendChild(createProductItemElement(computer)));
};

const fetchForId = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
   const computer = await response.json();
   ol.appendChild(createCartItemElement(computer));
};

const addCart = () => {
  const btnAddCart = document.querySelectorAll('.item__add');
  btnAddCart.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.parentNode.firstChild.innerText;
      fetchForId(id);
    });
  });
};

const saveLocalStorage = () => {
  setTimeout(() => {
    localStorage.setItem('cart', ol.innerHTML);
    totalPrice();
  }, 500);
};

document.addEventListener('click', () => saveLocalStorage());

const loadLocalStorage = () => {
  const cartSaved = localStorage.getItem('cart');
  if (cartSaved) {
    ol.innerHTML = cartSaved;
    ol.childNodes.forEach((li) => li.addEventListener('click', cartItemClickListener));
  }
};

window.onload = function onload() {
  fetchProductList()
  .then(() => loadLocalStorage())
  .then(() => addCart())
  .then(() => totalPrice());
  };