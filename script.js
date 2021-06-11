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

function appendChildCartItems(li) {
  const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(li);
}

function cleanItemFromCart(event) {
  const deleteProduct = event;
  deleteProduct.target.outerHTML = '';
}

function clearAllCart() {
  const buttonClear = document.querySelector('.empty-cart');
   buttonClear.addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = '';
    localStorage.clear('products');
  });
}

function returnsSaveProducts() {
  if (localStorage.getItem('products')) {
    const contentLocalStorage = localStorage.getItem('products');
    const split = contentLocalStorage.split('//');    
    split.map((item) => {
      const li = document.createElement('li');
        li.className = 'cart__item';
        li.innerHTML = item;
        li.addEventListener('click', cleanItemFromCart);
        return appendChildCartItems(li);
    });
  }
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
      li.addEventListener('click', cleanItemFromCart);
      appendChildCartItems(li);

      saveProductsLocalStorage(productTextFormat);
      clearAllCart();
}

async function fetchAPIProduct({ id: skuReceived = this.id }) {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${skuReceived}`);
    const { id: sku, title: name, price: salePrice } = await response.json();
    createCartItemElement(sku, name, salePrice);
  } catch (error) { 
    alert('Ops, deu ruim');
  }
}

function buttonItemAdd() {
  const button = document.querySelectorAll('.item__add');
  button.forEach((btn) => btn.addEventListener('click', fetchAPIProduct));
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
    alert('Ops, deu ruim');
  }
}

window.onload = async function onload() { 
  await fetchAPI();
  returnsSaveProducts();
};
