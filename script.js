const cartItems = document.querySelector('.cart__items');
const total = document.querySelector('.total-price');

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

// function secEventListener(id) {
//   const cartItems = document.querySelector('.cart__items');
//   fetch(`https://api.mercadolibre.com/items/${id}`)
//   .then((response) => response.json())
//   .then((item) => cartItems.appendChild(createCartItemElement(item)));
// }

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const dif = event.target.innerText.split('$')[1];
  cartItems.removeChild(event.target);
  total.innerHTML = parseFloat(total.innerHTML) - dif;
  localStorage.setItem('cartItem', cartItems.innerHTML);
  localStorage.setItem('total', total.innerHTML);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const sumCart = (price) => {
  if (total.innerHTML === '') {
    total.innerHTML += price;
  } else {
    total.innerHTML = parseFloat(total.innerHTML) + price;
  }
};

// const fetchItem = async (id) => {
//   await fetch(`https://api.mercadolibre.com/items/${id}`);
// };

const setEvent = () => {
  const items = document.querySelectorAll('.item');
  items.forEach((element) => element.lastChild.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${element.firstChild.innerHTML}`)
      .then((response) => response.json())
      .then((item) => {
        cartItems.appendChild(createCartItemElement(item));
        sumCart(item.price);
      })
      .then(() => {
      localStorage.setItem('cartItem', cartItems.innerHTML);
      localStorage.setItem('total', total.innerHTML);
    });
  }));
};

const fetchProduct = () => {
  const items = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((item) => item.results.map((e) => items.appendChild(createProductItemElement(e))))
  .then(() => setEvent());
};

const reloadSavedCart = () => {
  cartItems.innerHTML = localStorage.getItem('cartItem');
  total.innerHTML = localStorage.getItem('total');
};

const cleanCart = () => {
  cartItems.innerHTML = '';
  total.innerHTML = '';
  localStorage.setItem('total', total.innerHTML);
  localStorage.setItem('cartItem', cartItems.innerHTML);
};
const cleanButton = document.querySelector('.empty-cart');
cleanButton.addEventListener('click', cleanCart);

window.onload = () => {
  fetchProduct();
  reloadSavedCart();
};