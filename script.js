const URL_ML = 'https://api.mercadolibre.com/sites/MLB/search'; 
const sectionItems = document.querySelector('.items');
const cartItem = document.querySelector('.cart__items');

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

 function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} 

function cartItemClickListener(event) {
  return event.target.remove();
} 

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} 

function addToCart(event) {
      const data = event.target.parentElement;
      const id = getSkuFromProductItem(data);
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((product) => {
        const createCart = createCartItemElement(product);
        cartItem.appendChild(createCart);
    });
}
function fetchEcommerceAsync() {
  fetch(`${URL_ML}?q=$computador`)
    .then((response) => response.json())
    .then((products) => products.results.forEach((product) => {
     const createItem = createProductItemElement(product);
     sectionItems.appendChild(createItem);
      createItem.lastChild.addEventListener('click', addToCart);
  }));
}

window.onload = function onload() { 
  fetchEcommerceAsync();
};