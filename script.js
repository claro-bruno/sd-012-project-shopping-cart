window.onload = function onload() { };
const cartItems = document.querySelector('.cart__items');
const eraseButton = document.querySelector('.empty-cart');
const totalPrice = document.querySelector('.total-price');
const items = document.querySelector('.items');
const totalSoma = [];

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const storage = (key, value) => {
  localStorage.setItem(`${key}`, value);
};

// ex5
const totalValue = (valor) => {
  totalSoma.push(valor);
  console.log(totalSoma);
  const total = totalSoma.reduce((acc, value) => acc + value, 0);
  localStorage.setItem('totalPrice', total);
  totalPrice.innerText = total;
  console.log(total);
};

// ex3
function cartItemClickListener(event) {
  const valor = parseFloat(event.target.innerHTML.split('$')[1]);
  console.log(event.target.innerHTML.split('$'));
  totalValue(-valor);
  event.target.remove();
  storage('cartSave', cartItems.innerHTML);
}

// ex4
const returnSaved = () => {
  cartItems.innerHTML = localStorage.getItem('cartSave');
  const lis = document.querySelectorAll('.cart__item');
  lis.forEach((li) => li.addEventListener('click', cartItemClickListener));
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// ex1
const fetchProducts = (item) => fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
    .then((data) => data.json())
    .then((format) => format.results)
    .catch((erro) => console.log(erro));

// ex2
const addToCart = () => {
  const buttons = document.querySelectorAll('button.item__add'); 
  buttons.forEach((button) => button.addEventListener('click', (event) => {
  const id = getSkuFromProductItem(event.target.parentNode);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((res) => res.json())
    .then((json) => {
      totalValue(json.price);
      return cartItems.appendChild(createCartItemElement(json));
    })
    .then(() => storage('cartSave', cartItems.innerHTML));
  }));
};

// ex6
const eraseCart = () => {
  eraseButton.addEventListener('click', () => {
    localStorage.clear();
    cartItems.innerHTML = '';
  totalSoma.splice(0, totalSoma.length);
  totalPrice.innerHTML = 0;
  });
};

window.addEventListener('load', async () => {
  const section = document.querySelector('.items');
  const products = await fetchProducts('computador');
  items.firstChild.remove();
  products.forEach((product) => section.appendChild(createProductItemElement(product)));
  addToCart();
  returnSaved();
  eraseCart();
  if (!localStorage.totalPrice) { 
    totalValue(0);
  } else {
  totalValue(Number(localStorage.totalPrice));
  }
});
