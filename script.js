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

}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const fetchComputador = () => {
  const itens = document.querySelector('.items');

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((computador) => computador.results)
    .then((items) => items.forEach((api) => itens.appendChild(createProductItemElement(api))));
};

const fetchId = (idItem) => {
  const cartItems = document.querySelector('.cart__items');
  const product = {};
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((response) => response.json())
    .then((object) => {
      const { id, title, price } = object;
      product.sku = id;
      product.name = title;
      product.salePrice = price;

      return cartItems.appendChild(createCartItemElement(product));
    });
};

const addToCart = () => {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const buttonId = event.target.parentNode.firstChild.innerText;
      return fetchId(buttonId);
    }
  });
};

window.onload = function onload() {
  fetchComputador();
  addToCart();
};