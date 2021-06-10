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
  const cart = event.target.parentNode;
  const getPrice = event.target.innerHTML.split('$');
  const price = parseFloat(getPrice[getPrice.length - 1]);
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = parseFloat(totalPrice.innerHTML) - price;
  cart.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function cartAdd(endpoint) {
  const cartItems = document.querySelector('.cart__items');
  const addButtons = document.querySelectorAll('.item__add');
  addButtons.forEach((button) => button.addEventListener('click', () => {
    const item = button.parentNode;
    const itemId = getSkuFromProductItem(item);
    const product = endpoint.filter((getProduct) => getProduct.id === itemId)[0];
    const { id: sku, title: name, price: salePrice } = product;
    const cartItem = createCartItemElement({ sku, name, salePrice });
    cartItems.appendChild(cartItem);
    const totalPrice = document.querySelector('.total-price');
    totalPrice.innerHTML = parseFloat(totalPrice.innerHTML) + salePrice;
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
  // const totalPrice = document.querySelector('.total-price');
  emptyButton.addEventListener('click', () => {
  const cartItems = document.querySelector('.cart__items');
  const items = document.querySelectorAll('li');
  items.forEach((item) => cartItems.removeChild(item));
  const totalPriceForLint = totalPrice;
  totalPriceForLint.innerHTML = 0;
  });
}

window.onload = function onload() {
  const items = document.querySelector('.items');
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
    .then((totalPrice) => emptyCart(totalPrice));
};
