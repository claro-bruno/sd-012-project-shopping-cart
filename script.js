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

function createProductItemElement() {
  const urlProducts = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const section = document.createElement('section');
  section.className = 'item';
  fetch(urlProducts)
  .then((response) => response.json())
  .then((indice) => indice.results)
  .then((items) => {
      (items.forEach((item) => {
      section.appendChild(createCustomElement('span', 'item__sku', item.id));
      section.appendChild(createCustomElement('span', 'item__title', item.title));
      //  section.appendChild(createProductImageElement(item.image));
      section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  }));
  });

  return section;
}

const getSerchResults = () => {
  const urlProducts = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const idItem = document.querySelector('.items');
  fetch(urlProducts)
  .then((response) => response.json())
  .then((indice) => indice.results)
  .then((items) => items.forEach((item) => idItem.appendChild(createProductItemElement())));
};



function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  addE

}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
 getSerchResults();
};