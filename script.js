let arrayStorage = []; 
let total = 0;

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

function sum() {
  const price = arrayStorage.map((valor) => valor.price);
  total = price.reduce(function (Accumulator, num) {
    return Accumulator + num;
  }, 0);
  total = Math.round(total * 100) / 100;
  console.log(total);
  const totalprice = document.getElementsByClassName('total-price');
  totalprice[0].innerHTML = total;
} 

function sub() {
  const price = arrayStorage.map((valor) => valor.price);
  total = price.reduce(function (Accumulator, num) {
    return Accumulator - num;
  }, 0);
  total = Math.round(total * 100) / 100;
  total = Math.abs(total);
  console.log(total);
  const totalprice = document.getElementsByClassName('total-price');
  totalprice[0].innerHTML = total;
} 

function removeStoreData(element) {
  const id = element.innerText.substr(5, 13);
  arrayStorage = arrayStorage.filter((item) => item.id !== id);
  const stringStorage = JSON.stringify(arrayStorage);
  localStorage.setItem('products', stringStorage); 
  sub();
}

function cartItemClickListener(event) {
  event.target.remove();
  removeStoreData(event.target);
}

function storeData(obj) {
  arrayStorage.push(obj);
  const stringStorage = JSON.stringify(arrayStorage);
  localStorage.setItem('products', stringStorage); 
  sum();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getStoreData() {
  const cartItems = document.querySelector('.cart__items');
  if (localStorage.getItem('products') !== null) {
    arrayStorage = JSON.parse(localStorage.getItem('products'));
    arrayStorage.forEach((item) => {
      const product = {};
      const { id, title, price } = item;
      product.sku = id;
      product.name = title;
      product.salePrice = price;
      cartItems.appendChild(createCartItemElement(product));
   });
  }
}

function clickItemAdd() {
  const product = {};
  const buttons = document.querySelectorAll('.item__add');
  const cartItems = document.querySelector('.cart__items');
  buttons.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const idEvent = event.target.parentElement.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${idEvent}`)
      .then((response) => response.json())
      .then((item) => {
        const { id, title, price } = item;
        product.sku = id;
        product.name = title;
        product.salePrice = price;
        storeData(item);
        cartItems.appendChild(createCartItemElement(product));
      });
    });
  });
}

function getandCreateItems() {
  const product = {};
  const loading = document.querySelector('.loading');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((items) => {
      document.getElementsByClassName('items')[0].removeChild(loading);
      items.results.forEach((item) => {
        const { id, title, thumbnail } = item;
        product.sku = id;
        product.name = title;
        product.image = thumbnail;
        document.querySelector('.items').appendChild(createProductItemElement(product));
      });
    })  
    .then(() => clickItemAdd());  
}

function removeAllCartItems() {
  const cartItems = document.querySelector('.cart__items');
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((item) => cartItems.removeChild(item));  
}

window.onload = async () => {  
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.innerText = 'loading';
  // const items = 
  document.querySelector('.items').appendChild(loading);
  await getandCreateItems(); 
  getStoreData();
  sum();
    
  const removebtn = document.querySelector('.empty-cart');
  removebtn.addEventListener('click', removeAllCartItems);
};
