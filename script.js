const cartItems = document.querySelector('.cart__items');

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) { 
  cartItems.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadingMsg() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

const apiFetch = async () => {
  const sectionItems = document.querySelector('.items');
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((array) => array.results.forEach((products) => { 
    sectionItems.appendChild(createProductItemElement(products));
  }));
    loadingMsg();
};

function cartFetch(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`) 
    .then((response) => response.json())
    .then((results) => {
      const object = { 
        sku: results.id, 
        name: results.title, 
        salePrice: results.price, 
      };
      cartItems.appendChild(createCartItemElement(object));
    });
}

function addCart() {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      cartFetch(event.target.parentNode.firstElementChild.innerText);
    }
  });
}

const removeAllCart = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
  cartItems.innerHTML = '';
  });
};

window.onload = function onload() {
  apiFetch();
  addCart();
  removeAllCart();
};