const carr = document.querySelector('.cart__items');

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
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const searchComputer = async () => {
  const apiFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const fetchJson = await apiFetch.json();
  const apiResults = fetchJson.results;
  const selectItem = document.querySelector('.items');
  apiResults.forEach((products) => 
  selectItem.appendChild(createProductItemElement(products)));
};

const searchId = async (id) => {
  const apiFetch = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const computer = await apiFetch.json();
  carr.appendChild(createCartItemElement(computer));
};

document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('item__add')) {
    const id = event.target.parentNode.firstChild.innerText;
    searchId(id);
  }
});

window.onload = function onload() { 
  searchComputer();
};