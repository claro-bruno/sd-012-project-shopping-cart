window.onload = function onload() {
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetchList(URL)
    .then((r) => r.results)
    .then((items) => items.forEach((item) => createProductItemElement(item)))
    .then(() => cartClickListener())
    .catch((error) => console.log(error));
};

function fetchList(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((r) => r.json())
      .then((obj) => resolve(obj))
      .catch((err) => reject(err));
  });
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const parent = document.querySelector('section.items');
  appendElement(section, parent);
}

const appendElement = (el, parent) => parent.appendChild(el);

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartClickListener() {
  // coloque seu código aqui
  const btnList = document.querySelectorAll('.item__add');
  btnList.forEach((btn) => btn.addEventListener('click', (e) => {
    const target = e.target.parentElement;
    const URL = `https://api.mercadolibre.com/items/${getSkuFromProductItem(target)}`;
    fetchList(URL)
      .then((r) => createCartItemElement(r))
      .catch((error) => console.log(error));
  }));
}

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  const parent = document.querySelector('ol.cart__items');
  appendElement(li, parent);
  return li;
}