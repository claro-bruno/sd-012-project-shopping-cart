window.onload = function onload() {
  createItemsList('milka');
  loadLocalStorage();
};

let total = 0;

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
  updateLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createItemsList = (searchTerm) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`).then((response) => {
    response.json().then((itemList) => {
      itemList.results.forEach((specificItem) => {
        const itemsSection = document.querySelector('.items');
        itemsSection.appendChild(createProductItemElement(specificItem));
      });
    });
  });
}

document.addEventListener('click', (event) => {
  if (event.target.className === 'item__add') {
    fetchItemPrice(getSkuFromProductItem(event.target.parentElement));
  };
  if (event.target.className === 'cart__item') {
    cartItemClickListener(event);
  };
});

const fetchItemPrice = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`).then((response) => {
    response.json().then((item) => {
      const cartSection = document.querySelector('.cart__items');
      cartSection.appendChild(createCartItemElement(item));
      updateLocalStorage();
    });
  });
}

const updateLocalStorage = () => {
  localStorage.setItem('backup', document.querySelector('.cart__items').innerHTML);
}

const loadLocalStorage = () => {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('backup')
}