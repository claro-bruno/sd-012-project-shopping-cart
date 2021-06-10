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
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function apiFetch() { 
  const list = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => json.results.forEach((item) => {
      list.appendChild(createProductItemElement(item))
    }));
};

function fetchCart(id) {
  const cartItems = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((item) => {
      const product = { 
        sku: item.id, 
        name: item.title, 
        salePrice: item.price, 
      };
      cartItems.appendChild(createCartItemElement(product));
    });
}

function addToCart() {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      fetchCart (event.target.parentNode.firstElementChild.innerText);

    }
  });
}
  
window.onload = function onload() { 
  apiFetch();
  addToCart();
};
