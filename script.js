const cartList = document.querySelector('.cart__items');
const cartLi = document.getElementsByClassName('cart__item');

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

function saveList() {
  localStorage.setItem('cartList', cartList.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove(cartLi);
  saveList();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function addItemInCart(event) {
  const classItem = event.target.parentElement;
  const itemId = getSkuFromProductItem(classItem);
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
    const result = await response.json();
    cartList.appendChild(createCartItemElement(result));
    saveList();
  } catch (error) {
    console.log(error);
  }
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addItemInCart);

  return section;
}

function showComputers(computer) {
  const sectionItems = document.querySelector('.items');

  const { id, title, thumbnail } = computer;

  const createProduct = createProductItemElement({ id, title, thumbnail });

  sectionItems.appendChild(createProduct);
}

function getApiComputers() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => response.json())
      .then((computers) => resolve(computers));    
  });
}
function computersList() {
   getApiComputers()
    .then((computers) => {
      computers.results.forEach((computer) => showComputers(computer));
    });
}

function clearCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    while (cartList.firstChild) {
      cartList.removeChild(cartList.firstChild);
    }
    localStorage.clear();
  });
}

function recoverCartList() {
  cartList.innerHTML = localStorage.getItem('cartList');
  cartList.addEventListener('click', (event) => {
    event.target.remove(cartLi);
    saveList();
  });
}

clearCart();

window.onload = function onload() { 
  computersList();
  recoverCartList();
};
