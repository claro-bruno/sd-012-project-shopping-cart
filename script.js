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

// 1
async function fetchApi() {
const apiFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
const apiFetchJson = await apiFetch.json();
const apiResults = apiFetchJson.results;
const items = document.querySelector('.items');
apiResults.forEach((item) => items.appendChild(createProductItemElement(item)));
}

// 2
async function addProductToCart (id) {
  const fetchItems = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const fetchJson = await fetchItems.json();
  const cartItems = document.querySelector('.cart__items');
  cartItems[0].appendChild(createCartItemElement(fetchJson));
}

function createCartItemElement({  id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function cartItemClickListener() {
  // coloque seu código aqui event
  document.addEventListener('click', function () {
    const itemId = ;
    
  })
}



// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }



window.onload = function onload() { 
fetchApi();
addProductToCart();
};