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

// 5
function updatePrice() {
  let total = 0;
  const cartItem = document.querySelectorAll('.cart__item');
  // console.log(cartItem);
  cartItem.forEach((element) => {
      const price = +element.innerText.split('$')[1]; // esse + foi indicação de um colega na monitoria, poderia ter sido Number()
      total += price;
      // console.log(total);
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = total;
}

// 4
const localStorageSave = () => {
  const cart = cartItems.innerHTML;
  localStorage.setItem('cart', cart);
};

const getLocalStorage = () => {
  const getItem = localStorage.getItem('cart');
  cartItems.innerHTML = getItem;
  updatePrice(); // 5
};

// 6
function updateLocalStorage() {
  updatePrice();
  localStorage.clear();
  localStorageSave();
}

function cleanCart() {
  cartItems.innerHTML = ''; 
  updateLocalStorage();
}

function eventCleanCart() {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', cleanCart);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// 3
function cartItemClickListener(event) {
  // coloque seu código aqui event
  cartItems.removeChild(event.target);
  localStorageSave(); // 4
  updatePrice(); // 5
  // updateLocalStorage(); // 5
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
  cartItems.appendChild(createCartItemElement(product));
  localStorageSave();
  updatePrice();
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
  eventCleanCart();
};