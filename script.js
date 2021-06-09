function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  // Cria elemento
  const e = document.createElement(element);
  // Adiciona uma classe e um texto 
  e.className = className;
  e.innerText = innerText;
  return e;
}
// 'Reatribuindo os valores que o parametro vai receber'
function createProductItemElement({ id: sku, tittle: name, thumbnail: image }) {
  // Cria elemento
  const section = document.createElement('section');
  // Da uma classe a ele
  section.className = 'item';
  // Adiciona 'filhos'
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

// Requisito 1 onload fetch API
const items = document.querySelector('.items');
const fetchMercadoLivre = () => {
  const ApiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(ApiMercadoLivre)
  .then((response) => response.json())
  .then((arr) => arr.results.forEach((elements) => items
  .appendChild(createProductItemElement(elements))));
};

window.onload = function onload() {
  fetchMercadoLivre();
};