const API_MERCADO_LIVRE = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const listOrdener = 'ol.cart__items';
const loading = document.getElementsByClassName('loading');
const shopCart = document.getElementsByClassName('cart__items'); // antiga ol
// ------------------------------------------------------------------------------------

function saveListLocalStorage() {

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function cartItemClickListener(event) {
  // código aqui
  event.target.remove();
  saveListLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchListItems() {
  const itemsElements = document.querySelector('.items');
  loading[0].remove();
  fetch(`${API_MERCADO_LIVRE}`)
    .then((response) => response.json())
    .then((response) => response.results)
    .then((items) => items.forEach((item) => 
      itemsElements.appendChild(createProductItemElement(item))));
      
}

async function addItemToCart(event) {
  let itemAPI = await fetch(`https://api.mercadolibre.com/items/${event}`);
  itemAPI = await itemAPI.json();
  shopCart[0].appendChild(createCartItemElement(itemAPI));
}

document.addEventListener('click', function ({ target }) {
  if (target.classList.contains('item__add')) {
    const idItem = target.parentElement.firstChild.innerText;
    addItemToCart(idItem);
  }
});

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function emptyShoppingCart() {
  const emptyCartButton = document.querySelector('button.empty-cart');
  const cartItems = document.querySelector(listOrdener);
  emptyCartButton.addEventListener('click', () => {
    cartItems.innerHTML = '';
    localStorage.clear();
  });
}

window.onload = function onload() {
  fetchListItems();
  addItemToCart();
  emptyShoppingCart();
};
