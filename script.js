const olCart = document.querySelector('.cart__items');
const totalValue = document.querySelector('.total-price');

function cartItemClickListener(event) {
  // coloque seu código aqui
  const content = event.target.innerHTML;
  const number = content.slice(content.indexOf('$') + 1, content.length);
  totalValue.innerText = (parseFloat(totalValue.innerText) - number).toFixed(1);
  localStorage.removeItem(event.target.id);
  localStorage.setItem('value', totalValue.innerText);
  olCart.removeChild(event.target);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = id;
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (event) => {
  const id = event.target.parentElement.firstChild.innerHTML;
  let searchAPI = await fetch(`https://api.mercadolibre.com/items/${id}`);
  searchAPI = await searchAPI.json();
  await localStorage.setItem(`${olCart.children.length}`, 
  JSON.stringify({ id: searchAPI.id, title: searchAPI.title, price: searchAPI.price }));
  totalValue.innerText = parseFloat(totalValue.innerText) + searchAPI.price;
  localStorage.setItem('value', totalValue.innerText);
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

const clearCart = () => {
  olCart.innerText = '';
  totalValue.innerText = '0';
  localStorage.clear();
};

document.querySelector('.empty-cart').addEventListener('click', clearCart);

const loadLocalStorage = () => {
  const ol = document.querySelector('.cart__items');
  const localStore = Object.keys(localStorage);
  localStore.forEach((id) => {
    if (id !== 'value') {
      const itemParseado = JSON.parse(localStorage.getItem(id));
      ol.appendChild(createCartItemElement(itemParseado));
    }
  });
  totalValue.innerText = Number(localStorage.getItem('value'));
};

window.onload = function onload() {
  fetchItems();
  loadLocalStorage();
};