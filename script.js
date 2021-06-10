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

function fetchProducts(url) {
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
    const itemsList = document.querySelector('.items');
    return fetch(url)
      .then((response) => response.json())
      .then((array) => array.results.forEach((item) => itemsList
      .appendChild(createProductItemElement(item))));
  }
  throw new Error('endpoint não existe');
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

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

function fetchAddToCart(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((object) => {
      const newObj = { 
        sku: object.id, 
        name: object.title, 
        salePrice: object.price, 
      };
      const olCartItems = document.querySelector('.cart__items');
      return olCartItems.appendChild(createCartItemElement(newObj));
    });
}

function addEventAddToCart() {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const targetId = event.target.parentNode.firstElementChild.innerText;
      return fetchAddToCart(targetId);
    }
  });
}

window.onload = function onload() { 
  fetchProducts('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  addEventAddToCart();
};