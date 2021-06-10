const listURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const cartItem = '.cart__items';
const total = '.total-price';

const removeLoading = () => {
  const parentElement = document.querySelector('body');
  const element = document.querySelector('.loading');

  parentElement.removeChild(element);
};

const addTotalPrice = (price) => {
  const totalElement = document.querySelector(total);
  let totalPrice;

  if (localStorage.getItem('totalPrice') !== null) {
    totalPrice = Number(localStorage.getItem('totalPrice'));
  } else {
    totalPrice = 0;
  }

  totalPrice += price;

  localStorage.setItem('totalPrice', totalPrice);
  totalElement.innerHTML = totalPrice;
};

const subTotalPrice = (price) => {
  const totalElement = document.querySelector(total);
  let totalPrice = Number(localStorage.getItem('totalPrice'));

  totalPrice -= price;

  localStorage.setItem('totalPrice', totalPrice);
  totalElement.innerHTML = totalPrice;
};

const setLocalStorage = () => {
  const cartItems = document.querySelector(cartItem);
  
  if (localStorage.length !== 0) {
    localStorage.removeItem('cartList');
  }

  localStorage.setItem('cartList', cartItems.innerHTML);
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

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    const parentElement = document.querySelector(cartItem);
    parentElement.removeChild(event.target);
    subTotalPrice(salePrice);
    setLocalStorage();
  });
  return li;
}

const appendItem = (element, parentClass) => {
  const parentElement = document.querySelector(parentClass);

  parentElement.appendChild(element);
};

const fetchSomething = async (URL) => {
  const fetchObject = fetch(URL)
    .then((response) => response
      .json()
      .then((object) => object));
  
  return fetchObject;
};

const createItemList = async (itemList) => itemList
  .forEach((item) => appendItem(createProductItemElement(item), '.items'));

const addButtonEvent = async () => {
  const itemList = document.querySelectorAll('.item');
  
  itemList.forEach((item) => {
    const button = item.querySelector('button');
    button.addEventListener('click', async () => {
      const itemID = getSkuFromProductItem(item);
      const itemObj = await fetchSomething(`https://api.mercadolibre.com/items/${itemID}`);
      const itemLi = createCartItemElement(itemObj);
      appendItem(itemLi, cartItem);
      setLocalStorage();
      addTotalPrice(itemObj.price);
    });
  });
};

const getCartFromLocalStorage = () => {
  const cartItems = document.querySelector(cartItem);
  const totalElement = document.querySelector(total);

  let cartContent;
  let totalPrice;

  if (localStorage.length !== 0) {
    cartContent = localStorage.getItem('cartList');
    totalPrice = localStorage.getItem('totalPrice');
    cartItems.innerHTML = cartContent;
    totalElement.innerHTML = totalPrice;
  }
};

const eraseCart = () => {
  const eraseButton = document.querySelector('.empty-cart');

  eraseButton.addEventListener('click', () => {
    const cartItems = document.querySelector(cartItem);
    const totalPrice = document.querySelector(total);

    cartItems.innerHTML = '';
    totalPrice.innerHTML = '';

    localStorage.clear();
  });
};

const asyncFuncList = async () => {
  try {
    const fetchedObject = await fetchSomething(listURL);
    const productList = fetchedObject.results;
    await createItemList(productList);
    await addButtonEvent();
    getCartFromLocalStorage();
    removeLoading();
  } catch (error) {
    console.log('Error');
  }
};

window.onload = function onload() {
  asyncFuncList();
  eraseCart();
};
