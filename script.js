const COMPUTER_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const ITEM_URL = 'https://api.mercadolibre.com/items/';
const stringCart = '.cart__items';

function cartAddLocalStore() {
  if (localStorage.length !== 0) {
    localStorage.removeItem('cart');
  }
  const itemCart = document.querySelector(stringCart).innerHTML;
  localStorage.setItem('cart', itemCart);  
}

function facilityKeysComputer(computer) {
    return {
      sku: computer.id,
      name: computer.title,
      image: computer.thumbnail,
    };
}

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

function createProductItemElement({ sku, name, image }) {
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
  if (event.target.classList.contains('cart__item')) {
  const itemTarget = event.target;
  const listCart = document.querySelector(stringCart);
  listCart.removeChild(itemTarget);
  }
}

function cartSavedLocalStore() {
  const getCart = document.querySelector(stringCart);
  if (localStorage.length !== 0) {
    getCart.innerHTML = localStorage.getItem('cart');
    const childrenGetCart = getCart.childNodes;
    childrenGetCart.forEach((child) => child.addEventListener('click', cartItemClickListener));  
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const listCart = document.querySelector(stringCart);
  listCart.appendChild(li);
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return li; 
}

function renderNewComputers(newComputers) {
  newComputers.forEach((newcomputer) => {
    const element = createProductItemElement(newcomputer);
    document.getElementsByClassName('items')[0]
    .appendChild(element);
  });
}

function getTotalPrice() {
  const totalPrice = document.querySelector('.total-price');
}

const fetchComputer = () => {
  fetch(COMPUTER_URL)
  .then((response) => response.json())
  .then((computers) => computers.results.map((computer) => facilityKeysComputer(computer)))
  .then((newComputers) => renderNewComputers(newComputers))
  .then(() => document.querySelector('.loading').remove());
};

const fetchItemID = (id) => {
  fetch(`${ITEM_URL}${id}`)
  .then((response) => response.json())
  .then((results) => createCartItemElement(results))
  .then(() => cartAddLocalStore())
  .then(() => getTotalPrice());

};

const addToCart = () => {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const localId = event.target.parentElement.firstElementChild.innerText;
      fetchItemID(localId);
    } 
  });
};

window.onload = function onload() {
  fetchComputer();
  addToCart(); 
  cartSavedLocalStore(); 
 };