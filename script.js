const cartItems = document.querySelector('ol.cart__items');

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// ou 4
const localStorageSave = () => {
  const cart = cartItems.innerHTML;
  localStorage.setItem('cart', cart);
};

const getLocalStorage = () => {
  const getItem = localStorage.getItem('cart');
  cartItems.innerHTML = getItem;
};

// 3
function cartItemClickListener(event) {
  // coloque seu código aqui event
  cartItems.removeChild(event.target);
  // event.target.remove();
  localStorageSave(); 
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 1
async function fetchApi() {
  const apiFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const apiFetchJson = await apiFetch.json();
  const apiResults = apiFetchJson.results;
  const items = document.querySelector('.items');
  apiResults.forEach((item) => items.appendChild(createProductItemElement(item)));
}

// 2, 3 
async function buttonAdd(id) {
  const fetchItems = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const product = await fetchItems.json();
  // const { id: sku, title: name, price: salePrice };  
  cartItems.appendChild(createCartItemElement(product));
  localStorageSave();
}

document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('item__add')) {
    const id = event.target.parentNode.firstChild.innerText;
    buttonAdd(id);
  }
});

window.onload = function onload() { 
  fetchApi();
  getLocalStorage();
};