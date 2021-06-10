// const print = (param) => console.log(param);

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  const carrinho = document.querySelector('ol');
  localStorage.setItem('cartList', carrinho.innerHTML);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

 const fetchItem = async () => {
  const QUERY = 'computador';
  const sectionItem = document.querySelector('.items');
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then((resp) => resp.json())
    .then((array) => array.results.forEach((item) => 
    sectionItem.appendChild(createProductItemElement(item))));
};

const fetchCart = async (id) => {
  const itemID = id;
  const cartItem = document.querySelector('.cart__items');
  await fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((resp) => resp.json())
    .then((item) => {
    cartItem.appendChild(createCartItemElement(item));
    localStorage.setItem('cartList', cartItem.innerHTML);
    });
};

const addCart = () => {
  const getButton = document.querySelectorAll('.item');
  getButton.forEach((element) => element.addEventListener('click', () => {
    const id = getSkuFromProductItem(element);
    fetchCart(id);
  }));
};

const getFromStorage = () => {
  const carrinho = document.querySelector('ol');
  carrinho.innerHTML = localStorage.getItem('cartList');
  const item = carrinho.querySelectorAll('li');
  item.forEach((e) => {
    e.addEventListener('click', cartItemClickListener);
  });
};

window.onload = function onload() { 
  fetchItem().then(() => {
    addCart();
  });
  getFromStorage();
};