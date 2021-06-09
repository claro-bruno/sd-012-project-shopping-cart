// window.onload = function onload() { };

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

function createProductItemElement({ sku, name, image }) {
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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function saveCart() {
  const cartItems = document.getElementsByClassName('cart__items')[0].innerHTML;
  localStorage.setItem('cart', cartItems);
}

function addItemToCart(target) {
  const id = getSkuFromProductItem(target.path[1]);
  fetch(`https://api.mercadolibre.com/items/${id}`).then((response) =>
    response.json().then((computer) => {
      const computerFunc = computer;
      computerFunc.sku = computerFunc.id;
      computerFunc.name = computerFunc.title;
      computerFunc.salePrice = computerFunc.price;
      const items = document.getElementsByClassName('cart__items')[0];
      const item = createCartItemElement(computerFunc);
      items.appendChild(item);
      saveCart();
    }));
}

const getItems = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json()
    .then((computers) => {
      computers.results.forEach((computer) => {
        const computerFunc = computer;
        computerFunc.sku = computerFunc.id;
        computerFunc.name = computerFunc.title;
        computerFunc.image = computerFunc.thumbnail;
        const items = document.getElementsByClassName('items')[0];
        const item = createProductItemElement(computerFunc);
        items.appendChild(item);
        item.addEventListener('click', addItemToCart);
      });
    }));

window.onload = function onload() {
  getItems();
  const cart = localStorage.getItem('cart');
  if (cart) {
    const ol = document.getElementsByClassName('cart__items')[0];
    ol.innerHTML = cart;
  }
};
