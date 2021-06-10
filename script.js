function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, event) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  if (element === 'button') {
    function sectionEventListener() {
      const cartItems = document.querySelector('.cart__items');
      fetch(`https://api.mercadolibre.com/items/${event}`)
      .then((response) => response.json())
      .then((item) => cartItems.appendChild(createCartItemElement(item)));
    }
    e.addEventListener('click', sectionEventListener);
  }

  return e;
}

// function sectionEventListener(id) {
//   const cartItems = document.querySelector('.cart__items');
//   fetch(`https://api.mercadolibre.com/items/${id}`)
//   .then((response) => response.json())
//   .then((item) => cartItems.appendChild(createCartItemElement(item)));
// }

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', id));
  section.appendChild(createCustomElement('span', 'item__sku', id));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchProduct = () => {
  const items = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((item) => item.results.map((e) => items.appendChild(createProductItemElement(e))));
};

// const myPromise = new Promise((resolve, reject) => {

// });

window.onload = () => {
  fetchProduct();
};
