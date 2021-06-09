const cartItems = '.cart__items';

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
  // coloque seu código aqui
  event.target.remove();
  localStorage.setItem('cartList', document.querySelector(cartItems).innerHTML);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchComputers = async () => {
  const results = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
  .then((data) => data.results);
  
  return results;
};

const appendComputers = async () => {
  const computers = await fetchComputers();
  const itemsSection = document.querySelector('.items');
  computers.forEach((computer) => {
    itemsSection.appendChild(createProductItemElement(computer));
  });
};

const appendCartItem = (info) => {
  const cart = document.querySelector(cartItems);
  const data = createCartItemElement(info);
  cart.appendChild(data);
};

document.addEventListener('click', async (event) => {
  if (event.target.className === 'item__add') {
    const section = event.target.parentElement;
    const itemSku = getSkuFromProductItem(section);
    const info = await fetch(`https://api.mercadolibre.com/items/${itemSku}`)
    .then((response) => response.json());
    appendCartItem(info);
    localStorage.setItem('cartList', document.querySelector(cartItems).innerHTML);
  }
});

window.onload = function onload() {
  const cartList = document.querySelector(cartItems);
  cartList.innerHTML = localStorage.getItem('cartList');
  appendComputers();
};
