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

// function secEventListener(id) {
//   const cartItems = document.querySelector('.cart__items');
//   fetch(`https://api.mercadolibre.com/items/${id}`)
//   .then((response) => response.json())
//   .then((item) => cartItems.appendChild(createCartItemElement(item)));
// }

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

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchProduct = async () => {
  const items = document.querySelector('.items');
  const fetchedItems = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((item) => item.results.map((e) => items.appendChild(createProductItemElement(e))));
  return fetchedItems;
};

window.onload = () => {
  fetchProduct().then(() => {
    const items = document.querySelectorAll('.item');
    items.forEach((element) => element.lastChild.addEventListener('click', () => {
      const cartItems = document.querySelector('.cart__items');
      fetch(`https://api.mercadolibre.com/items/${element.firstChild.innerHTML}`)
      .then((response) => response.json())
      .then((item) => cartItems.appendChild(createCartItemElement(item)));
    }));
  });
};
