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
const getItems = () => new Promise((resolve) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then((response) => {
    response.json().then((products) => resolve(products));
  });
});
const pageProducts = (products) => {
  const loading = createCustomElement('h2', 'loading', 'LOADING...');
  const productsList = document.querySelector('.items');
  productsList.appendChild(loading);
  products.then((items) => {
    productsList.removeChild(loading);
    items.results.forEach((item) => {
      const product = createProductItemElement({
         sku: [item.id], name: [item.title], image: [item.thumbnail] });
      productsList.appendChild(product);
    });
  });
  return productsList;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const updatePrice = async (price) => {
  const totalPrice = document.querySelector('.total-price');
  const actualPrice = parseFloat(totalPrice.innerHTML).toFixed(2);
  const updatedTotalPrice = parseFloat(actualPrice) + price;
  totalPrice.innerHTML = parseFloat(Math.round(updatedTotalPrice * 100) / 100);
  localStorage.setItem('totalPrice', totalPrice.innerHTML);
  await totalPrice;
};

function cartItemClickListener(event) {
  const cartList = document.querySelector('.cart__items');
  cartList.removeChild(event.target);
  const priceItem = parseFloat(event.target.innerText.split('$')[1]); 
  updatePrice(priceItem * -1);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const getItemById = (id) => new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${id}`).then((response) => {
    response.json().then((product) => resolve(product));
    });
  });

const verifyItem = (item) => {
  if (item.className === 'item__add') {
    return true;
  }
};  
const localStorageKeys = () => localStorage.length + 1;
const totalPriceFunction = async () => {
  const cart = document.querySelector('.cart');
  const totalPrice = document.createElement('h2');
  totalPrice.className = 'total-price';
  cart.appendChild(totalPrice);
  totalPrice.innerHTML = '0';
  // if (localStorage.getItem('totalPrice') !== null) {
  //   updatePrice(parseFloat(localStorage.getItem('totalPrice')));
  // } 
  await cart;
};

const addToCart = (item) => {
    const itemSku = getSkuFromProductItem(item);
    const cart = document.querySelector('.cart');
    const cartList = document.querySelector('.cart__items');
    const loading = createCustomElement('h2', 'loading', 'LOADING...');
    cart.appendChild(loading);
    return getItemById(itemSku).then((product) => {
      cart.removeChild(loading);
      const cartItem = createCartItemElement(
        { sku: [product.id], name: [product.title], salePrice: [product.price] },
);
      cartList.appendChild(cartItem);
      updatePrice(product.price);
      localStorage.setItem(localStorageKeys(), cartItem.innerHTML);
    });
  };
  const addToCartListener = () => {
    document.body.addEventListener('click', (event) => {
      if (verifyItem(event.target) === true) {
        return addToCart(event.target.parentNode);
      }
    });
  };
const getStorageItems = () => {
  const listStorageItens = [];
  const cartItems = document.getElementsByClassName('cart__items')[0];
  for (let itemIndex = 2; itemIndex <= localStorage.length; itemIndex += 1) {
    const storageItem = localStorage.getItem(`${itemIndex}`);
    listStorageItens.push(storageItem);
  }
  listStorageItens.forEach((item) => {
    const product = document.createElement('li');
    product.className = 'cart__item';
    product.innerHTML = item;
    cartItems.appendChild(product);
  });
};

const cleanCart = () => {
  localStorage.clear();
  const cart = document.querySelector('.cart');
  const totalPrice = document.querySelector('.total-price');
  const cartItems = document.getElementsByClassName('cart__items')[0];
  cart.removeChild(cartItems);
  const cartItemsRenew = document.createElement('ol');
  cartItemsRenew.className = 'cart__items';
  cart.appendChild(cartItemsRenew);
  cart.removeChild(totalPrice);
  totalPriceFunction();
};

const cleanCartListener = () => {
  document.body.addEventListener('click', (event) => {
    if (event.target.className === 'empty-cart') {
      cleanCart();
    }
  });
};

window.onload = function onload() {
  pageProducts(getItems());
  totalPriceFunction();
  getStorageItems();
  addToCartListener();
  cleanCartListener();
};