const cartList = document.getElementsByClassName('cart__items');
const totalPriceElement = document.getElementsByClassName('total-price');
let totalPrice = 0;
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const getItemFromAPI = async (id) => {  
  const fetchAPI = await fetch(`https://api.mercadolibre.com/items/${id}`);
  let item;
  await fetchAPI.json().then((result) => {    
    item = result;
  });
  return item;
};

const getPromise = async (item) => {
  const words = item.split(' ');
  const itemID = words[1];
  const itemGeted = await getItemFromAPI(itemID);
  return itemGeted.price;
};

// Para conseguir implementar essa função, entrei nesse site https://itnext.io/why-async-await-in-a-foreach-is-not-working-5f13118f90d
// o meu problema era: await não funcionava dentro de um forEach.
// Solução: o async/await aparentemente não funciona dentro de um forEach segundo o site aqui listado então a solução for usar um for pra chamar
// essa função.
const getItemInfos = async (index) => {
  const keys = Object.keys(localStorage);
  const items = keys.filter((key) => key.startsWith('SKU'));  
  const price = await getPromise(items[index]);
  // console.log(price);
  calculateTotal(price);
};

const calculateTotal = (value) => {
  totalPrice += value;
  console.log(totalPrice);
};

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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(event) {
  // coloque seu código aqui
  localStorage.removeItem(event.target.innerHTML);
  const keys = Object.keys(localStorage);
  const items = keys.filter((key) => key.startsWith('SKU'));
  for (let index = 0; index < items.length; index += 1) {
    getItemInfos(index);
  }
  cartList[0].removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(li.innerText, sku);
  const keys = Object.keys(localStorage);
  const items = keys.filter((key) => key.startsWith('SKU'));
  for (let index = 0; index < items.length; index += 1) {
    getItemInfos(index);
  }
  return li;
}

const addEvent = (event, callback) => {
  const itemAddButtons = document.getElementsByClassName('item__add');
  for (let index = 0; index < itemAddButtons.length; index += 1) {
    itemAddButtons[index].addEventListener(event, callback);
  }
};

const addCartItem = async (event) => {
  const section = event.target.parentElement;
  const id = section.firstElementChild.innerHTML;  
  const item = await getItemFromAPI(id);
  cartList[0].appendChild(createCartItemElement(item));
};

const createList = () => {
  const itensSection = document.getElementsByClassName('items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then((response) => {
    response.json().then(({ results }) => {
      for (let index = 0; index < results.length; index += 1) {
        const newSection = createProductItemElement(results[index]);
        itensSection[0].appendChild(newSection);
      }
      addEvent('click', addCartItem);
    });
  });
};

const getCartItems = () => {
  // localStorage.clear();
  const keys = Object.keys(localStorage);
  const items = keys.filter((key) => key.startsWith('SKU'));  
  items.forEach((item) => {    
    const itemElement = document.createElement('li');
    itemElement.className = 'cart__item';
    itemElement.innerHTML = item;
    itemElement.addEventListener('click', cartItemClickListener);
    cartList[0].appendChild(itemElement);
  });
  for (let index = 0; index < items.length; index += 1) {
    getItemInfos(index);
  }
};

window.onload = function onload() {
  getCartItems();
  createList();
};
