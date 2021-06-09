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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
 
// }

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function itemClickListener() {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => {
    const button = item.querySelector('button');
    const id = item.querySelector('.item__sku').innerHTML;
    button.addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((product) => {
        const carrinho = document.querySelector('.cart__items');
        const produto = createCartItemElement(product);
        carrinho.appendChild(produto);
      });
    });
  });
}

async function fetchingProducts() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => data.results)
  .then((results) => {
    results.forEach((product) => {
      const items = document.querySelector('.items');
      const newItem = createProductItemElement(product);
      items.appendChild(newItem);
    });
  });
  itemClickListener();
}

fetchingProducts();

