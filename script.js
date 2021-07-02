const clearBtn = document.querySelector('.empty-cart');

const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const sectionItems = document.querySelector('.items');

const body = document.querySelector('body');

const list = '.cart__items';

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
  localStorage.clear();
  let num = 0;
  Object.values(items).forEach((item) => {
    localStorage.setItem(num, item.innerText);
    num += 1;
  });
}

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  localStorage.removeItem(event.target.id);
  setLocalStorage();
}

const removeList = () => {
  clearBtn.addEventListener('click', () => {
    document.querySelector(list).innerHTML = '';
    localStorage.clear();
  });
};

removeList();
      
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function initCart() {
  for (let index = 0; index < localStorage.length; index += 1) {
    const li = createCartItemElement({ sku: null, name: null, salePrice: null });
    li.innerText = localStorage.getItem(index);
    document.querySelector(list).appendChild(li);
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
  } catch (error) {
    console.log(error);
  }
};