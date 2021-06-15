const olitems = document.getElementsByClassName('cart__items')[0];
const dataCart = [];
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

function cartItemClickListener(event) {
 
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const list = document.createElement('li');
  list.className = 'cart__item';
  list.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  list.addEventListener('click', cartItemClickListener(list));
  document.querySelector('ol').appendChild(list);
}

const getItemCart = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((response) => response.json())
  .then((product) => createCartItemElement(product));
};

function createProductItemElement({ sku, name, image }) {
  const sect = document.createElement('section');
  sect.className = 'item';

  sect.appendChild(createCustomElement('span', 'item__sku', sku));
  sect.appendChild(createCustomElement('span', 'item__title', name));
  sect.appendChild(createProductImageElement(image));
  const bt = sect.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  sect.appendChild(bt);
  bt.addEventListener('click', (event) => {
  getItemCart(event.target.parentNode.firstChild.innerText);  
  });
return sect;
}
const getProducts = (array) => {
  const sectionItems = document.querySelector('.items');
  array.results.forEach((current) => {
    const {
      id: sku,
      title: name,
      thumbnail: image,
    } = current;
    sectionItems.appendChild(createProductItemElement({ sku, name, image }));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function insertCart() {
  const itemCart = document.querySelector('.cart__items');
  itemCart.innerHTML = '';
  }

function getItem() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computer';
  fetch(url)
    .then((response) => response.json())
    .then((array) => getProducts(array));
}

window.onload = function onload() {
getItem();
};
