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

function createButton(element, className, id, innerText) {
  const e = document.createElement(element);
  e.id = id;
  e.className = className;  
  e.innerText = innerText;
  return e;
}

function addCartItems(li) {
  const cartItems = document.querySelector('.cart__items');
    cartItems.appendChild(li);
}

function cleanItemFromCart(event) {
  const deleteProduct = event;
  deleteProduct.target.outerHTML = '';
  // falta deletar o item do localStorage  
}

function clearAllCart() {
  const buttonClear = document.querySelector('.empty-cart');
   buttonClear.addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = '';
    localStorage.clear('products');
    const total = document.querySelector('.total-price');
    total.innerHTML = 'Total:';
  });
}

function totalPrice() {
  const produto = document.querySelectorAll('.cart__item');
  const array = [];
  produto.forEach((item) => {
    const split = item.textContent.split('$');
    const number = parseFloat(split[1]);
    array.push(number);
  });
  const sum = array.reduce((acc, curr) => acc + curr, 0);
  
  const total = document.querySelector('.total-price');
  total.innerHTML = `Total: ${sum}`;
}

function returnsSaveProductsLocalStorage() {
  if (localStorage.getItem('products')) {
    const contentLocalStorage = localStorage.getItem('products');
    const split = contentLocalStorage.split('//');    
    split.map((item) => {
      const li = document.createElement('li');
        li.className = 'cart__item';
        li.innerHTML = item;
        li.addEventListener('click', cleanItemFromCart);
        return addCartItems(li);
    });
  }
  totalPrice();
}

function saveProductsLocalStorage(skuReceived) {
  let selectedProduct = skuReceived;
  if (!localStorage.products) {
    localStorage.setItem('products', selectedProduct);
  } else {
    selectedProduct = `${localStorage.products}//${skuReceived}`;
  }  
  localStorage.setItem('products', selectedProduct);
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  const productTextFormat = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.innerText = productTextFormat;
  addCartItems(li);
  li.addEventListener('click', cleanItemFromCart);
  
  saveProductsLocalStorage(productTextFormat);
}

async function fetchAPIProduct({ id: skuReceived = this.id }) {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${skuReceived}`);
    const { id: sku, title: name, price: salePrice } = await response.json();
    createCartItemElement(sku, name, salePrice);
    totalPrice();
  } catch (error) { 
    alert('Ops, deu ruim no botao');
  }
}

function buttonItemAdd() {
  const button = document.querySelectorAll('.item__add');
  button.forEach((btn) => btn.addEventListener('click', fetchAPIProduct));
}

function createTotalPriceElement() {
  const h4 = document.createElement('h4');
  h4.className = 'total-price';
  h4.innerText = 'Total:';

  const sectionCart = document.querySelector('.cart');
  sectionCart.appendChild(h4);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createButton('button', 'item__add', `${sku}`, 'Adicionar ao carrinho!'));

  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);

  buttonItemAdd();
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

async function fetchAPI() {
  try {
    const response = await fetch(API_URL);
    const { results } = await response.json();
    results.forEach((item) => createProductItemElement(item));
  } catch (error) { 
    alert('Ops, deu ruim no inicio');
  }
}

window.onload = async function onload() { 
  await fetchAPI();
  createTotalPriceElement();
  returnsSaveProductsLocalStorage();
  clearAllCart();
};
