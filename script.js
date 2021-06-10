function cartItemClickListener(event) {
  const ol = document.querySelector('ol');
  ol.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img; 
}

 function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addPrductsCart = async (item) => {
  const ol = document.querySelector('.cart__items');
  const idProduct = getSkuFromProductItem(item);
  const url = `https://api.mercadolibre.com/items/${idProduct}`;
  let result = await fetch(url);
  
  result = await result.json();
  const { id: sku, title: name, price: salePrice } = result;
  ol.appendChild(createCartItemElement({ sku, name, salePrice }));
  if (localStorage.getItem('shoppingCart') === null) {
    localStorage.setItem('shoppingCart', JSON.stringify(ol.innerHTML));
  } else {
    localStorage.setItem('shoppingCart', JSON.stringify(ol.innerHTML));
  }
}; 

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
  const btnAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAdd.addEventListener('click', () => addPrductsCart(section));
  section.appendChild(btnAdd);

  return section;
}

const loadProducts = async (filter) => {
  const section = document.querySelector('.items');
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${filter}`;
  let resultRequest = await fetch(url);
  if (resultRequest.ok) {
    resultRequest = await resultRequest.json();
    const resultProducts = await resultRequest.results;
    await resultProducts.forEach(({ id: sku, title: name, thumbnail: image }) => {
       section.appendChild(createProductItemElement({ sku, name, image }));
    });
  }
};

window.onload = function onload() {
  const ol = document.querySelector('.cart__items');
  loadProducts('computador');
  if (localStorage.getItem('shoppingCart')) {
    ol.innerHTML = JSON.parse(localStorage.getItem('shoppingCart'));
  }
 };