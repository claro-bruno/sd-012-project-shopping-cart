const apiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

const fetchML = () => {
  const itens = document.querySelector('.items');
  fetch(apiMercadoLivre)
  .then((response) => response.json())
  .then((response) => response.results)
  .then((arr) => arr.forEach((item) => itens.appendChild(createProductItemElement(item))));
};

window.onload = function onload() {
  fetchML();
 };

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

console.log(getSkuFromProductItem());

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
console.log(createCartItemElement());

// const fetchML = () => {
//   const sectionItens = document.querySelector('.items');
//   const teste = 
//   fetch(apiMercadoLivre)
//   .then((response) => response.json())
//   .then((response) => response.results)
//   .then((array) => array.forEach((products) => sectionItens.appendChild(createProductItemElement(products))))
// };