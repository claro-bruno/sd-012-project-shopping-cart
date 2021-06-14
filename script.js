const items = document.querySelector('.items');
// const loading = document.querySelector('.loading');
const cartItems = document.querySelector('.cart__items');
// const addItem = document.querySelector('.item__add');
// const totalPrice = document.querySelector('.total-price');
const emptyCart = document.querySelector('.empty-cart');

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

// requisito 3
function cartItemClickListener(event) {
  const removeItem = event.target;
  removeItem.parentNode.removeChild(event.target);
}

// requisito 6
  function removeCartItems() {
    emptyCart.addEventListener('click', () => {
      cartItems.innerHTML = '';
    });
  }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 2
async function fetchCartItems(ItemID) {
  const cartItems = document.querySelector('.cart__items');
  const response = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
   const computer = await response.json();
   cartItems.appendChild(createCartItemElement(computer));
}

// requisito 2
const addToCart = () => {
  const addItem = document.querySelectorAll('.item__add');
  addItem.forEach((button) => {
    button.addEventListener('click', (event) => {
      const item = event.target.parentElement.querySelector('.item__sku').innerText;
      fetchCartItems(item).then((product) => createCartItemElement(product));    
    });
  });
};

// requisito 1
async function fetchAPI() {
    const fetchML = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const getResponse = await fetchML.json();
    const productItem = getResponse.results;
   productItem.forEach((product) => items.appendChild(createProductItemElement(product)));
    }

window.onload = function onload() {
  fetchAPI()
  .then(() => addToCart())
  .then(() => removeCartItems());
};