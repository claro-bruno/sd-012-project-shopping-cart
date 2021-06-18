const cartItems = document.querySelector('.cart__item');

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

const localSaveCart = () => {
  const ol = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', ol);
};

const localStorageSaveItems = () => {
  const saved = localStorage.getItem('cart');
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = saved;
  saved.addEventListener('click',clickClearCart);
};
  
function cartItemClickListener(event) {
  event.target.remove();
  localSaveCart();  
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);  
    document.querySelector('ol').appendChild(li);
    localSaveCart();
    }
  
const addItemsCart = (sku) => {
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then((response) => response.json())
        .then((product) => createCartItemElement(product));
    };

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(btn);
  btn.addEventListener('click', (event) => {
  addItemsCart(event.target.parentNode.firstChild.innerText);
  });

  return section;
}

function showComputers(computer) {
  const sectItems = document.querySelector('.items');

  const { id, title, thumbnail } = computer;
  const createProduct = createProductItemElement({ id, title, thumbnail });
  sectItems.appendChild(createProduct);
}

const getProducts = (array) => {
  const sectionItems = document.querySelector('.items');
  array.results.forEach((current) => {
  const { 
    id: sku, 
    title: name, 
    thumbnail: image,
  } = current;
  sectionItems.appendChild(createProductItemElement({ sku, name, image }));
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getItem() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computer';
  fetch(url)
    .then((response) => response.json())
    .then((array) => getProducts(array));
}

function clearAllCart() {
 const listCart=  document.querySelector('ol');
 listCart.innerHTML = ''; 
 localStorage.clear(); 
}

const clickClearCart = () => {
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', clearAllCart);
};

window.onload = function onload() {
  getItem();
  localStorageSaveItems();
  clickClearCart();
};
