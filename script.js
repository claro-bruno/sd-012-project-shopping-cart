window.onload = function onload() { 
};

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

// 1
async function fetchApi() {
const items = document.querySelector('.items');
const apiFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
const apiFetchJson = await apiFetch.json();
apiFetchJson.results.forEach((item) => items.appendChild(createProductItemElement(item)));
}
fetchApi();

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener() {
//   // coloque seu código aqui event
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }
