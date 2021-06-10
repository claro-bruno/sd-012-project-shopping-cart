const cartList = '.cart__items';

async function sumTotalPrice() {
  const price = document.querySelector('.price');
  let totalprice = 0;
  const itens = Object.values(document.querySelector(cartList).children);
  itens.forEach((item) => {
    const valor = item.innerHTML.split('PRICE: $')[1];
    totalprice += parseFloat(valor);
    totalprice.toFixed(2);
  });
  price.innerHTML = totalprice;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartProducts() {
  const cartFull = document.querySelector('.empty-cart').nextElementSibling;
  const items = cartFull.children;
  localStorage.clear();
  let num = 0;
  Object.values(items).forEach((item) => {
    localStorage.setItem(num, item.innerText);
    num += 1;
  });
}

function cartItemClickListener(event) {
  const cart = document.querySelector(cartList);
  cart.removeChild(event.target);
  localStorage.removeItem(event.target.id);
  cartProducts();
  sumTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function cartItem(id) {
  const objId = await fetch(`https://api.mercadolibre.com/items/${id}`).then((r) => r.json());
  const { title, price } = objId;
  const newCart = createCartItemElement({ sku: id, name: title, salePrice: price });
  const list = document.querySelector('.cart__items');
  list.appendChild(newCart);
  sumTotalPrice();
  cartProducts();
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', (event) => {
      const id = event.target.parentNode.firstChild.innerText;
      cartItem(id);
    });
  }
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

async function verifetch(url) {
    if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
      return fetch(url)
      .then((r) => r.json())
      .then((r) => r.results)
      .then((r) => r.forEach((element) => {
        const { id, title, thumbnail } = element;
        const section = createProductItemElement({
          sku: id,
          name: title,
          image: thumbnail });
        const elementoPai = document.querySelector('.items');
        elementoPai.appendChild(section);
      }));
    }
      throw new Error('endpoint does not exist');
}

function clearCart() {
  const cart = document.querySelector(cartList);
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => cart.removeChild(item));
  cartProducts();
  sumTotalPrice();
}

function initCart() {
  for (let index = 0; index < localStorage.length; index += 1) {
    const li = createCartItemElement({ sku: null, name: null, salePrice: null });
    li.innerText = localStorage.getItem(index);
    document.querySelector(cartList).appendChild(li);
  }
  sumTotalPrice();
}

window.onload = function onload() { 
  verifetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then(() => {
    const section = document.querySelector('.container');
    const load = document.querySelector('.loading');
    section.removeChild(load);
  });
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', clearCart);
  initCart();
};