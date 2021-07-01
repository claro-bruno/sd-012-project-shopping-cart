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

function fetchAPI(item) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  fetch(url)
    .then((response) => response.json()
    .then((itemList) => {
      itemList.results.forEach((items) => {
        const section = document.querySelector('.items');
        section.appendChild(createProductItemElement(items));
      });
    }));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(id) {
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
    .then((response) => {
      response.json().then((itemList) => {
        const section = document.getElementsByClassName('cart__items')[0];
        section.appendChild(createCartItemElement(itemList));
    }); 
  });
}

document.addEventListener('click', (event) => {
  if (event.target.className === 'item__add') {
    addToCart(getSkuFromProductItem(event.target.parentElement));
  }
});

window.onload = function onload() {
  fetchAPI('computador');
};
