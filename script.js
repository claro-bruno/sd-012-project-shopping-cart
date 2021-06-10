// window.onload = function onload() {};

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

function createProductItemElement({ sku: id, name: title, image: thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku: id, name: title, salePrice: price }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

const fetchPC = async () => {
  const tagSection = document.querySelector('.items');
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const apiFetch = await fetch(API_URL);
  const apiJson = await apiFetch.json();
  const jsonResults = apiJson.results;
  jsonResults.forEach((product) => {
    const productList = createProductItemElement(product);
    tagSection.appendChild(productList);
  });
};
fetchPC();
