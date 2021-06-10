let items;

function upItems() {
  items = document.querySelector('.cart__items');
}
// -----------------------------------------------------------------------------------------------------
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// adiciona localstorage nos itens do carrinho
function storeListItems() {
  window.localStorage.mlList = items.innerHTML;
}

// -----------------------------------------------------------------------------------------------------
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// -----------------------------------------------------------------------------------------------------
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// -----------------------------------------------------------------------------------------------------
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// -----------------------------------------------------------------------------------------------------
function cartItemClickListener(event) {
  items.removeChild(event.target);
  storeListItems();
}

// -----------------------------------------------------------------------------------------------------
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// -----------------------------------------------------------------------------------------------------
function getItem() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((r) => r.json())
    .then((json) => {
      json.results.forEach((result) => {
        const itemsSec = document.querySelector('.items');
        itemsSec.appendChild(createProductItemElement(result));
      }); 
    });  
}

// -----------------------------------------------------------------------------------------------------
function getMlList() {
  const list = document.querySelector('.cart__items');
  const { mlList } = window.localStorage;

  if (!mlList) list.innerHTML = '';
  else list.innerHTML = mlList;
}

// -----------------------------------------------------------------------------------------------------
function addItemToCart(event) {
  if (event.target.className === 'item__add') {
    const itemID = getSkuFromProductItem(event.target.parentNode);
    fetch(`https://api.mercadolibre.com/items/${itemID}`)
      .then((r) => r.json())
      .then((json) => {
        items.appendChild(createCartItemElement(json));
        storeListItems();
      });
  }
}

function clear() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    items.innerHTML = '';
    storeListItems();
  });
}

// -----------------------------------------------------------------------------------------------------

function sumUp() {
  const finalPrice = document.querySelector('.total-price');
  const liProduct = document.querySelectorAll('.cart__item');
  const listofPr = [...liProduct];
  const finalSum = listofPr.reduce((acc, curr) => acc + Number(curr.innerHTML.split('$')[1]), 0);
  finalPrice.innerHTML = finalSum;
}

window.onload = function onload() { 
  getItem();
  getMlList(); 
  upItems();
  clear();
  sumUp();
  const itemsSec = document.querySelector('.items');
  itemsSec.addEventListener('click', addItemToCart);
};
