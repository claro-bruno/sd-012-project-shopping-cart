const cartItems = document.querySelector('.cart__items');
const cart = document.querySelector('.cart');
const allitemsPrice = document.querySelector('.total-price');

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

function cartItemClickListener(event, salePrice) {
  cartItems.removeChild(event.target);
  allitemsPrice.innerText = parseFloat(Number(allitemsPrice.innerText) - salePrice);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductList() {
  const itemsList = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((json) => {
    json.results.forEach((result) => {
      itemsList.appendChild(createProductItemElement(result));
    });
  })
  .then(() => {
    cart.removeChild(document.querySelector('.loading'));
    for (let index = 0; index < localStorage.length; index += 1) {
      const [id, title, salePrice] = localStorage.getItem(`Produto${index}`).split('|');
      const result2 = { id, title, salePrice };
      cart.appendChild(createCartItemElement(result2));
    }
  });
}

function addProduct(e) {
  if (e.target.className === 'item__add') {
    const id = getSkuFromProductItem(e.target.parentNode);
    fetch(`https://applicationCache.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((json) => {
      const itemList = document.querySelector('.cart__items');
      itemList.appendChild(createCartItemElement(json));
    });
  }
}

window.onload = function onload() {
  createProductList();
  const items = document.querySelector('.items');
  items.addEventListener('click', addProduct);
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    cartItems.innerHTML = '';
    allitemsPrice.innerText = '0';
    localStorage.clear();
  });
};
