const cartItem = document.querySelector('.cart__items');

function sumPrices() {
const listCart = document.querySelectorAll('.cart__item');
let sum = 0;
listCart.forEach((itens) => {
const liText = itens.innerText;
const posicaoInicial = liText.indexOf('$') + 1;
const posicaoFinal = liText.length;
const price = liText.substr(posicaoInicial, posicaoFinal);
const priceFinal = parseFloat(price);
sum += priceFinal;
});
const priceTotal = document.querySelector('.total-price');
priceTotal.innerText = sum;
}

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
  const olItens = cartItem.innerHTML;
  localStorage.setItem('cart', olItens);
};

const localStorageSaveItems = () => {
  const saved = localStorage.getItem('cart');
  cartItem.innerHTML = saved;
};
  
function cartItemClickListener(event) {
  event.target.remove();
  localSaveCart();  
  sumPrices();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);  
    document.querySelector('ol').appendChild(li);
    localSaveCart();
    sumPrices();
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
  const pLoading = document.querySelector('.loading');
  pLoading.remove();
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
 const listCart = document.querySelector('ol');
 listCart.innerHTML = ''; 
 localStorage.clear(); 
 sumPrices();
}

const clickClearCart = () => {
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', clearAllCart);
};

window.onload = function onload() {
  if (localStorage.cart) {
  const itemsCart = document.querySelectorAll('.cart__items');
  itemsCart.forEach((item) => {
  item.addEventListener('click', cartItemClickListener);  
  });
}
  getItem();
  localStorageSaveItems();
  clickClearCart();
  sumPrices();
  };
