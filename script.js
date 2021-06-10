const API_URL = 'https://api.mercadolibre.com/sites/MLB/search';
const API_ITEMS = 'https://api.mercadolibre.com/items/';
const MSG_ERROR = 'Estamos passando por problemas. Por Favor, tente mais tarde!';
const body = document.querySelector('body');
const items = document.querySelector('.items');
const cart = document.querySelector('.cart__items');
const total = document.querySelector('.total-price');
let search = 'computador';

const totalPriceEqualZero = () => {
  total.innerHTML = 0;
};

const totalPrice = () => {
  const prices = cart.childNodes;
  const regExp = /\d*\.?\d*$/;
  let result = 0;
  prices.forEach(({ innerHTML }) => {
    result += parseFloat(innerHTML.match(regExp));
  });
  total.innerHTML = result;
};

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
   cart.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createLoading = () => {
  const loading = createCustomElement('span', 'loading', 'loading...');
  body.appendChild(loading);
};

const removeLoading = () => {
  const loading = document.querySelector('.loading');
  if (loading) loading.remove();
};

const createProductsList = (obj) => {
  const itens = document.querySelector('.items');
  const arr = obj.results;
    arr.forEach((computer) => {
      itens.appendChild(createProductItemElement(computer));
    });
};

const fetchProductList = async (item) => {
  createLoading();
  try {
    const response = await fetch(`${API_URL}?q=${item}`);
    removeLoading();
    const obj = await response.json();
    createProductsList(obj);
  } catch (error) {
    alert(MSG_ERROR);
  }
};

const fetchForId = async (id) => {
  createLoading();
  try {
    const response = await fetch(`${API_ITEMS}${id}`);
    removeLoading();
    return await response.json();
  } catch (error) {
    alert(MSG_ERROR);
  }
};

const saveLocalStorage = () => {
  localStorage.setItem('cart', cart.innerHTML);
  totalPrice();
};

const addCart = () => {
  const btnAddCart = document.querySelectorAll('.item__add');
  btnAddCart.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = getSkuFromProductItem(btn.parentNode);
      fetchForId(id)
      .then((item) => cart
        .appendChild(createCartItemElement(item)))
      .then(() => saveLocalStorage());
    });
  });
};

document.addEventListener('click', () => saveLocalStorage());

const loadLocalStorage = () => {
  const cartSaved = localStorage.getItem('cart');
  if (cartSaved) {
    cart.innerHTML = cartSaved;
    cart.childNodes.forEach((li) => li.addEventListener('click', cartItemClickListener));
  }
};

const clearCart = () => {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    cart.innerHTML = '';
  });
};

const loader = () => {
  fetchProductList(search)
  .then(() => loadLocalStorage())
  .then(() => addCart())
  .then(() => totalPrice())
  .then(() => clearCart());
};

const clearItems = () => {
  items.innerHTML = '';
};

const addFoundItems = (value) => {
  search = value;
};

const searchEngine = () => {
  const searchInput = document.querySelector('#search');
  searchInput.addEventListener('keypress', (event) => {
    const pressEnter = document.getElementById('search-span');
    if (event.key === 'Enter' && !searchInput.value) return alert('O que você procura? =D');
    if (event.key === 'Enter') {
      clearItems();
      addFoundItems(searchInput.value);
      loader();
      searchInput.value = '';
      pressEnter.style.color = 'gold';
    } else {
      pressEnter.style.color = 'black';
    }
  });
};

window.onload = function onload() {
  totalPriceEqualZero();
  loader();
  searchEngine();
};