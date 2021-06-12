const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const API_PRODUCT = 'https://api.mercadolibre.com/items/';

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

function totalPrice() {
  const cartProduct = document.querySelectorAll('.cart__item');
  const arrayPrice = [];
  cartProduct.forEach((item) => {
    const split = item.textContent.split('$');
    const number = Number(split[1]);
    arrayPrice.push(number);
  });
  const sum = arrayPrice.reduce((acc, curr) => acc + curr, 0);
  
  const total = document.querySelector('.total-price');
  total.innerHTML = sum;
}

function clearAllCart() {
  const buttonClear = document.querySelector('.empty-cart');
   buttonClear.addEventListener('click', () => {
    const cartItems = document.querySelector('.cart__items');
    cartItems.innerHTML = '';
    localStorage.clear('products');
    totalPrice();
  });
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

/* function removeProductsLocalStorage(productReceived) {
  const selectedProduct = productReceived.textContent;
  console.log(`funcao recebe como parametro ${selectedProduct}`);

  const getStorage = localStorage.getItem('products');
  console.log(`conteudo do storage ${getStorage}`);

  const split = getStorage.split('//');
  console.log(`storage como array ${split}`);

  const filter = split.filter((item) => item !== selectedProduct);
  console.log(filter);

  const setStorage = localStorage.setItem('products', filter);
  console.log(setStorage);

  const remove = localStorage.removeItem(`${find}`);
  console.log(remove);
} */

function cleanItemFromCart(event) {
  const deleteProduct = event.target;
  const cartProduct = document.querySelector('.cart__items');
  cartProduct.removeChild(deleteProduct);
  totalPrice(); // calcula o preço
  // removeProductsLocalStorage(deleteProduct); // falta remover produto do localStorage
}

function saveProductsLocalStorage(productReceived) {
  let selectedProduct = productReceived;
  if (!localStorage.products) {
    localStorage.setItem('products', selectedProduct);
  } else {
    selectedProduct = `${localStorage.products}//${productReceived}`; // tirar o \n pro cyperess aceitar
  }  
  localStorage.setItem('products', selectedProduct);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  const productTextFormat = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.innerText = productTextFormat;
  addCartItems(li);

  saveProductsLocalStorage(productTextFormat); // Adiciona item ao localStorage
  li.addEventListener('click', cleanItemFromCart); // Limpa item do carrinho
}

async function fetchAPIProduct({ id: skuReceived = this.id }) {
  try {
    const response = await fetch(`${API_PRODUCT}${skuReceived}`);
    const data = await response.json();
    createCartItemElement(data); // adiciona item ao carrinho
    totalPrice(); // calcula o preço
  } catch (error) { 
    alert('Ops, deu ruim no botao');
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
  
  buttonItemAdd(); // cria item no carrinho atraves do botao
}

function createTotalPriceElement() {
  const h4 = document.createElement('h4');
  h4.className = 'total-price';

  const sectionTotal = document.querySelector('#total');
  sectionTotal.appendChild(h4);
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

async function fetchAPI() {
  try {
    const response = await fetch(API_URL);
    const { results } = await response.json();
    results.forEach((data) => createProductItemElement(data));
  } catch (error) { 
    alert('Ops, deu ruim no inicio');
  }
}

window.onload = async function onload() { 
  await fetchAPI(); // chama API
  createTotalPriceElement(); // cria elemento do preço total do carrinho
  returnsSaveProductsLocalStorage(); // retorna no carrinho itens salvos no localStorage
  clearAllCart(); // esvazia carrinho e localStorage
};
