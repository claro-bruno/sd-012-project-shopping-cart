window.onload = function onload() { };
const cartItems = document.querySelector('.cart__items');
const eraseButton = document.querySelector('.empty-cart');
const precoTotal = document.querySelector('.total-price');
const items = document.querySelector('.items');
const totalSoma = [];
const totalSubtracao = [];

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

const soma = (price) => {
  totalSoma.push(price);
  return totalSoma.reduce((total, valor) => (total * 100 + valor * 100) / 100, 0);
};
const subtracao = (price) => {
  totalSubtracao.push(price);
  return totalSubtracao.reduce((total, valor) => (total * 100 + valor * 100) / 100, 0);
};
const totalPrice = (mais = 0, menos = 0) => {
  const preco = document.createElement('section');
  const total = soma(mais) - subtracao(menos);
  localStorage.setItem('totalPrice', total);
  if (Number.isInteger(total)) {
    preco.innerText = total;
  } else {
    preco.innerText = parseFloat(total).toFixed(2);
  }
  precoTotal.innerHTML = '';
  precoTotal.appendChild(preco);
};

// ex3
function cartItemClickListener(event) {
  const valor = parseInt(event.target.innerHTML.split('$')[1], 10);
  totalPrice(0, valor);
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
      totalPrice(json.price, 0);
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
  totalSubtracao.splice(0, totalSubtracao.length);
  precoTotal.innerHTML = 'Total:';
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
  totalPrice(localStorage.getItem('total'));
});
