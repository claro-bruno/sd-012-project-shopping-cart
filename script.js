const getCartItems = '.cart__items';
const getTotalPrice = '.total-price';

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

function addLocalStorage() {
  if (localStorage.length !== 0) {
    localStorage.removeItem('cart');
    localStorage.removeItem('price');
  } 
  localStorage.setItem('cart', document.querySelector(getCartItems).innerHTML);
  localStorage.setItem('price', document.querySelector(getTotalPrice).innerHTML);
}

function cartItemClickListener(event) {
  const cart = event.target.parentNode;
  const price = Number(event.target.innerHTML.split('$')[1]);
  const totalPrice = document.querySelector(getTotalPrice);
  totalPrice.innerHTML = Math.round((totalPrice.innerHTML - price) * 100) / 100; // o roud aqui serve para remover erros de subtração de números decimais
  cart.removeChild(event.target);
  addLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function cartAdd(endpoint) {
  const cartItems = document.querySelector(getCartItems);
  const addButtons = document.querySelectorAll('.item__add');
  addButtons.forEach((button) => button.addEventListener('click', () => {
    const item = button.parentNode;
    const itemId = getSkuFromProductItem(item);
    const product = endpoint.filter((getProduct) => getProduct.id === itemId)[0];
    const { id: sku, title: name, price: salePrice } = product;
    const cartItem = createCartItemElement({ sku, name, salePrice });
    cartItems.appendChild(cartItem);
    const totalPrice = document.querySelector(getTotalPrice);
    totalPrice.innerHTML = Math.round(((Number(totalPrice.innerHTML) + salePrice)) * 100) / 100; // o roud aqui serve para remover erros de soma de números decimais
    addLocalStorage();
  }));
}

function createTotalPrice() {
  const cartSection = document.querySelector('.cart');
  const totalPrice = document.createElement('section');
  totalPrice.className = 'total-price';
  totalPrice.innerHTML = 0;
  cartSection.appendChild(totalPrice);
  return totalPrice;
}

function emptyCart(totalPrice) {
  const emptyButton = document.querySelector('.empty-cart');
  emptyButton.addEventListener('click', () => {
  const cartItems = document.querySelector(getCartItems);
  const items = document.querySelectorAll('li');
  items.forEach((item) => cartItems.removeChild(item));
  const totalPriceForLint = totalPrice;
  totalPriceForLint.innerHTML = 0;
  localStorage.clear();
  });
}

function getLocalStorage() {
  const cartItems = document.querySelector(getCartItems);
  const totalPrice = document.querySelector(getTotalPrice);
  if (localStorage.length !== 0) {
    cartItems.innerHTML = localStorage.getItem('cart');
    cartItems.childNodes.forEach((li) => li.addEventListener('click', cartItemClickListener));
    totalPrice.innerHTML = localStorage.getItem('price');
  }
}

function addLoading() {
  const body = document.querySelector('body');
  const header = document.createElement('header');
  header.className = 'loading';
  header.innerHTML = 'Carregando...';
  header.style.textAlign = 'center';
  body.appendChild(header);
  body.insertBefore(header, body.firstChild);
}

function removeLoading() {
  const header = document.querySelector('.loading');
  const headerParent = header.parentNode;
  headerParent.removeChild(header);
}

window.onload = function onload() {
  const items = document.querySelector('.items');
  addLoading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json()).then((obj) => obj.results)
    .then((endpoint) => {
      endpoint.forEach((product) => {
        const { id: sku, title: name, thumbnail: image } = product;
        const section = createProductItemElement({ sku, name, image });
        items.appendChild(section);
      });
      return endpoint;
    })
    .then((endpoint) => cartAdd(endpoint))
    .then(() => createTotalPrice())
    .then((totalPrice) => emptyCart(totalPrice))
    .then(() => getLocalStorage())
    .then(() => removeLoading())
    .catch(() => console.log('Oops! Algo deu errado!'));
};
