function cartItemClickListener(event) {
    // coloque seu código aqui
    return event;
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (event) => {
  const id = event.target.parentElement.firstChild.innerHTML;
  let searchAPI = await fetch(`https://api.mercadolibre.com/items/${id}`);
  searchAPI = await searchAPI.json();
  const olCart = document.querySelector('.cart__items');
  olCart.appendChild(createCartItemElement(searchAPI));
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, functiones) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  e.addEventListener('click', functiones);
  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button',
  'item__add', 'Adicionar ao carrinho!', addToCart));
  return section;
}

const fetchItems = async () => {
  let objComputer = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  objComputer = await objComputer.json();
  const items = document.querySelector('.items');
  objComputer.results.forEach((item) => {
    items.appendChild(createProductItemElement(item));
  });
};

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }

window.onload = function onload() {
  fetchItems();
};