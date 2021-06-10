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

const addItens = async (id) => {
  let item = await fetch(`https://api.mercadolibre.com/items/${id}`);
  item = await item.json();
  const cart = document.querySelector('.cart__items');
  cart.appendChild(createCartItemElement(item));
};

const callback = () => {
  const btnAdd = document.querySelectorAll('.item__add');
btnAdd.forEach((button) => {
  button.addEventListener('click', (event) => {
  const teste = event.target.parentElement.firstChild.innerText; // para pegar o elemento
  addItens(teste);
  });
});
};

const fetchML = () => {
  const itens = document.querySelector('.items');
  fetch(apiMercadoLivre)
  .then((response) => response.json())
  .then((response) => response.results)
  .then((arr) => arr.forEach((item) => itens.appendChild(createProductItemElement(item))))
  .then(() => callback());
};

window.onload = function onload() {
  fetchML();
 };

// const fetchML = () => {
//   const sectionItens = document.querySelector('.items');
//   const teste = 
//   fetch(apiMercadoLivre)
//   .then((response) => response.json())
//   .then((response) => response.results)
//   .then((array) => array.forEach((products) => sectionItens.appendChild(createProductItemElement(products))))
// };

// const addItens = (id) => {
//   // const teste = createProductItemElement();
//   const btnAdd = document.getElementsByClassName('item__add');
//   btnAdd.childNodes.forEach((button) => {
//     button.addEventListener('click', async () => {
//       let fetch = await fetch(`https://api.mercadolibre.com/items/${id}`)
//       fetch = await fetch.json()
//       fetch = await console.log('clicou')
//     })
//   })
// };