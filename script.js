const urlProducts = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

function getButton(teste) {
  return teste.querySelector('button.item__add');
}

function cartItemClickListener(_event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const catchId = () => {
  const allItem = document.querySelectorAll('.item');
  const ol = document.querySelector('.cart__items');
  allItem.forEach((item) => {
    const result = getSkuFromProductItem(item);
    const button = getButton(item);
    button.addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${result}`)
      .then((response) => response.json())
      .then((data) => createCartItemElement(data))
      .then((li) => ol.appendChild(li));
    });
});
};

const fetchURL = (url) => {
  const idItem = document.querySelector('.items');
  fetch(url)
  .then((response) => response.json())
  .then((indice) => indice.results)
  .then((items) => items.forEach((item) => idItem.appendChild(createProductItemElement(item))))
  .then(() => catchId());
};

window.onload = function onload() {
  fetchURL(urlProducts);
};
