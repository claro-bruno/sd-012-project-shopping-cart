const totalValue = document.querySelector('.total-price');

function toLocalStorage() {
  const total = totalValue;
  localStorage.setItem('teste', total.innerHTML);
  const localCartItems = document.getElementsByClassName('cart__items');
  localStorage.setItem('item', localCartItems[0].innerHTML);
}

function addTotalPrice(price) {
  const addTotalPric = totalValue;
  addTotalPric.innerText = price + parseFloat(addTotalPric.innerText);
}

function subTotalPrice(price) {
  const subTotalPric = totalValue;
  subTotalPric.innerText = parseFloat(subTotalPric.innerText) - price;
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
  const value = event.target.querySelector('.price').innerText;
  subTotalPrice(value);
  document.querySelector('ol.cart__items').removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span class='price'>${salePrice}</span>`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function removeAllCartElementsListener() {
  const cartItems = document.querySelector('.cart__items');
  const cartLength = cartItems.children.length;
  for (let index = 0; index < cartLength; index += 1) {
    cartItems.removeChild(cartItems.children[0]);
  }
  localStorage.clear();
}

function getItemsLocalStorage() {
  if (localStorage.getItem('teste')) {
    const totalPrice = totalValue;
    totalPrice.innerHTML = localStorage.getItem('teste');
  }
  const listCart = document.querySelector('ol.cart__items');
  listCart.innerHTML = localStorage.getItem('item');
  listCart.childNodes.forEach((child) => child.addEventListener('click', cartItemClickListener));
}

function addCart(event) {
  const itemId = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((resolve) => resolve.json())
    .then((resolve) => {
      const { id: sku, title: name, price: salePrice } = resolve;
      const element = createCartItemElement({ sku, name, salePrice });
      document.querySelector('.cart__items').appendChild(element);
      addTotalPrice(salePrice);
      toLocalStorage();
    });
}

function createItens() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((response) => {
      response.results.forEach((result) => {
        const { id: sku, title: name, thumbnail: image } = result;
        const element = createProductItemElement({ sku, name, image });
        document.querySelector('.items').appendChild(element);
      });
      document.querySelector('.loading').remove();
    })
    .then(() => {
      const allButtons = document.querySelectorAll('.item__add');
      allButtons.forEach((button) => {
        button.addEventListener('click', addCart);
      });
    });
}

window.onload = () => {
  document.querySelector('.items').appendChild(createCustomElement('span', 'loading', 'Loading.'));
  createItens(); 
  getItemsLocalStorage();
  document.querySelector('.empty-cart').addEventListener('click', removeAllCartElementsListener);
};