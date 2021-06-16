const items = document.getElementsByClassName('items')[0];
const cartList = document.getElementsByClassName('cart__items')[0];
const priceText = document.getElementsByClassName('total-price')[0];
// Requsito 4 e 5 feito baseado no Codigo de Adriana Biberg
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

function createProductItemElement({ id: sku, tittle: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const totalPrice = 0;

const sum = () => {
  let num = 0;
  if (cartList.childNodes !== null) {
    cartList.childNodes.forEach((element) => {
      num += parseFloat(element.innerText.split('$')[1]);
      priceText.innerText = totalPrice + num;
    });
    if (cartList.childNodes.length === 0) {
      priceText.innerText = 0;
    }
  }
};

const saveLocal = () => {
  const saveCart = [];
  if (cartList !== null) {
    cartList.childNodes.forEach((element) => {
      saveCart.push(element.innerText);
    });
    localStorage.setItem('saveCart', JSON.stringify(saveCart));
  }
};

function cartItemClickListener(event) {
  event.target.remove();
  saveLocal();
  sum();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchID = (event) => {
  const info = event.target.parentElement;
  const id = getSkuFromProductItem(info);
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((product) => {
    const createCart = createCartItemElement(product);
    cartList.appendChild(createCart);
    saveLocal();
    sum();
  });
};

const fetchAPI = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(url)
  .then((response) => response.json())
  .then((products) => products.results
  .forEach((product) => {
    const createItem = createProductItemElement(product);
    items.appendChild(createItem);
    createItem.lastChild.addEventListener('click', fetchID);
  }));
};

fetchAPI();

function getCart() {
  const storageCart = JSON.parse(localStorage.getItem('saveCart'));
  if (storageCart !== null) {
    storageCart.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = item;
      cartList.appendChild(li);
      li.addEventListener('click', cartItemClickListener);
    });
  }
}

window.onload = function onload() {
  getCart();
  sum();
};
