const clearBtn = document.querySelector('.empty-cart');

const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const sectionItems = document.querySelector('.items');

const body = document.querySelector('body');

const list = '.cart__items';

let sumPrice = 0;

const sumPrices = (price) => {
  console.log(price);
  if (price) {
    sumPrice += price;
  }
  document.querySelector('.total-price').innerHTML = sumPrice;
};

// const sumPrices = () => {
//   const items = document.querySelectorAll(list);
//   console.log(items);
//   const totalPrice = document.querySelector('.total-price');
//   let sumPrice = 0;
//   items.forEach((item) => {
//     sumPrice += parseFloat(item.innerHTML.split('$')[1]);
//     console.log(sumPrice);
//   });
//   totalPrice.innerHTML = Math.round(sumPrice * 100) / 100;
// };

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

async function fetchData() {
  return fetch(URL)
  .then((response) => response.json())
  .then((object) => object.results);
}

const computerObject = async () => {
  try {
    const object = await fetchData();
    object.forEach((element) => sectionItems.appendChild(createProductItemElement(element)));
  } catch (erro) {
    console.log('Error');
  }
};

function setLocalStorage() {
  const cartFull = document.querySelector('.empty-cart').nextElementSibling;
  const items = cartFull.children;
  const total = document.querySelector('.total-price');
  localStorage.clear();
  let num = 0;
  Object.values(items).forEach((item) => {
    localStorage.setItem(num, item.innerText);
    num += 1;
  });
  localStorage.setItem('price', JSON.stringify(total.innerText));
  console.log(total.innerText);
}

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  localStorage.removeItem(event.target.id);
  const eventTarget = event.target.innerHTML;
  sumPrice -= parseFloat(eventTarget.slice(eventTarget.indexOf('$') + 1));
  sumPrices();
  setLocalStorage();
}

const removeList = () => {
  clearBtn.addEventListener('click', () => {
    document.querySelector(list).innerHTML = '';
    localStorage.clear();
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    sumPrice = 0;
    sumPrices();
  });
};

removeList();
      
function createCartItemElement({ id: sku, title: name, price: salePrice = 0 }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = `${salePrice}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  sumPrice += salePrice;
  sumPrices();
  return li;
}

function initCart() {
  for (let index = 0; index < localStorage.length - 1; index += 1) {
    const li = createCartItemElement({ sku: null, name: null, salePrice: null });
    li.innerText = '';
    li.innerText = localStorage.getItem(index);
    document.querySelector(list).appendChild(li);
  }
  const savedPrice = localStorage.getItem('price');
  if (savedPrice) {
    sumPrices(parseFloat(JSON.parse(savedPrice)));
  }
}

initCart();
      
async function getProductsIds(id) {
  try {
    const api = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const data = await api.json();
    return data;
  } catch (erro) {
    return erro;
  }
}

async function addProduct() {
  const addBtn = document.querySelectorAll('.item__add');
  addBtn.forEach((btn) => { 
    const addList = document.querySelector(list);
    btn.addEventListener('click', async (event) => {
      const dataElement = event.target.parentElement.querySelector('.item__sku').innerText;
      const data = await getProductsIds(dataElement);
      addList.appendChild(createCartItemElement(data));
      setLocalStorage();
      sumPrices();
    });
  });
}

const loadingScreen = () => {
  const loading = document.querySelector('.loading');
  body.removeChild(loading);
};

window.onload = async function onload() {
  try {
    await computerObject();
    await addProduct();
    loadingScreen();
    cartItemClickListener();
    sumPrices();
  } catch (error) {
    console.log(error);
  }
};