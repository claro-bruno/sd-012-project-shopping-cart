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
  if (event.target.classList.contains('cart__item')) {
    const removeItem = event.target;
    removeItem.remove();
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchComputador = () => {
  const endpoint = document.querySelector('.items');

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((computador) => computador.results)
    .then((items) => items.forEach((item) => endpoint.appendChild(createProductItemElement(item))));
};

function localStorage1() {
  const cart = document.getElementsByClassName('cart__items');
  console.log(cart[0], 'cartItems');
  localStorage.setItem('userCart', cart[0].innerHTML);  
}

const fetchId = (idItem) => {
  const cartItems = document.querySelector('.cart__items');  
  const product = {};
  
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((response) => response.json())
    .then((object) => {
      const { id, title, price } = object;
      product.sku = id;
      product.name = title;
      product.salePrice = price;

      cartItems.appendChild(createCartItemElement(product));
      localStorage1();
    });    
  };

const addToCart = () => {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const buttonId = event.target.parentNode.firstChild.innerText;
      fetchId(buttonId);      
    }    
  });
};
function erase() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = '';
}

function emptyCart() {
  const emptybutton = document.querySelector('.empty-cart');  
  emptybutton.addEventListener('click', erase);
}

function getLocalStorage() {
  const cartfinal = document.getElementsByClassName('cart__items');
  const savedCart = localStorage.getItem('userCart');  
  if (savedCart) {
    cartfinal.innerHTML = savedCart;
  }
}

function getTotalValue() {
  const spanPrices = document.getElementsByClassName('items-prices');
  const cartElements = document.getElementsByClassName('cart__items');
  const cartArray = [...cartElements];
  // let totalValue = 0;
  if (cartArray.length > 0) {
  //   // cartArray.forEach((item) => totalValue += item.innerText.match(/(\d+)/));
  //   // cartArray.forEach((item) => totalValue += parseFloat(item.innerText.split('$')[1]));
  //   spanPrices.innerHTML = `Preço total: $${totalValue}`;
  }
}

window.onload = function onload() {
  fetchComputador();
  addToCart();
  emptyCart();
  getLocalStorage();
  getTotalValue();   
};
