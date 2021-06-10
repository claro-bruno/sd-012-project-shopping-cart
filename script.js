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

// Requisito 1, fiz baseado na mentoria do Isaac

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  }
   
// function getSkuFromProductItem(item) {
// return item.querySelector('span.item__sku').innerText;
// }

 // function cartItemClickListener(event) {
  // coloque seu código aqui
 // }

// function createCartItemElement({ sku, name, salePrice }) {
// const li = document.createElement('li');
// li.className = 'cart__item';
// li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
// li.addEventListener('click', cartItemClickListener);
// return li;
// }

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function fetchApi() {
  fetch(`${API_URL}`)
  .then((response) => response.json())
  .then((response) => response.results)
  .then((response) => response.forEach((item) => createProductItemElement(item)));
}

window.onload = () => {
  fetchApi();
};
