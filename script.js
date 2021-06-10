// Captura Elementos
const itemsSection = document.querySelector('.items');
const ol = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
let sum = 0;
const emptyCartBtn = document.querySelector('.empty-cart');

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
  const img = image.replace(/-I.jpg/g, '-O.jpg');
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(img));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function cartItemClickListener(event) {
  const cartItem = event.target;
  if (cartItem.tagName === 'LI') {
    cartItem.remove();
    const price = cartItem.innerText.split('$')[1];
    sum -= price;
    totalPrice.innerText = sum;
    localStorage.setItem('cart', ol.innerHTML);
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

const fetchItem = async (event) => {
  try {
    const id = event.target.parentElement.firstChild.innerText;
    let response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    response = await response.json();
    const { price } = response;
    const cartItem = createCartItemElement(response);
    ol.appendChild(cartItem);
    sum += Number(price);
  } catch (err) {
    throw new Error(err);
  }
  localStorage.setItem('cart', ol.innerHTML);
  totalPrice.innerText = sum;
};

const loading = () => {
  const load = document.querySelector('.loading');
  load.remove();
};

const fetchProducts = async () => {
  try {
    let response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    response = await response.json();
    response.results.forEach((computer) => {
      const item = createProductItemElement(computer);
      item.addEventListener('click', fetchItem);
      itemsSection.appendChild(item);
    });
  } catch (err) {
    throw new Error(err);
  }
  loading();
};

const emptyCart = () => {
  ol.innerHTML = '';
  localStorage.clear();
  sum = 0;
  totalPrice.innerText = sum;
};

emptyCartBtn.addEventListener('click', emptyCart);

window.onload = function onload() {
  fetchProducts();
  const cart = localStorage.getItem('cart');
  ol.innerHTML = cart;
  ol.addEventListener('click', cartItemClickListener);
};
