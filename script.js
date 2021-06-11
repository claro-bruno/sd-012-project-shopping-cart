const cartItems = document.querySelector('.cart__items');

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

function localStorage1() {
  localStorage.setItem('userCart', cartItems.innerHTML);  
}

function cartItemClickListener(event) {
  if (event.target.classList.contains('cart__item')) {
    const removeItem = event.target;
    removeItem.remove();
    localStorage1();
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
  const loading = document.querySelector('.loading');  

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((loading.innerText = 'loading'))
    .then((response) => response.json())
    .then((computador) => computador.results)
    .then((items) => items.forEach((item) => endpoint.appendChild(createProductItemElement(item))));
};

function removeloading() {
  const loading = document.querySelector('.loading');
  fetchComputador();
  if (loading) {
    setTimeout(() => {
      loading.remove();
    }, 100);   
  }
}

const fetchId = (idItem) => {
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
  cartItems.innerHTML = '';
  localStorage1();
}

function emptyCart() {
  const emptybutton = document.querySelector('.empty-cart');  
  emptybutton.addEventListener('click', erase);
}

function getLocalStorage() {
  const savedCart = localStorage.getItem('userCart');  
  if (savedCart) {
    cartItems.innerHTML = savedCart;
  }
}

function getTotalValue() {
  const spanPrices = document.getElementsByClassName('items-prices');
  
  let totalValue = 0;
  if (cartItems.length > 0) {
    cartItems.forEach((item) => {
      totalValue += parseFloat(item.innerHTML.match(/(\d+)/));
  //   // cartArray.forEach((item) => totalValue += parseFloat(item.innerText.split('$')[1]));
    });
    spanPrices.innerHTML = `Preço total: $${totalValue}`;
  }
}

window.onload = function onload() {
  removeloading();
  getLocalStorage();
  addToCart();
  emptyCart();
  getTotalValue();   
};
