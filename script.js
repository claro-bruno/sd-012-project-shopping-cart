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

function addCart(sku) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((item) => item.json())
    .then((product) => {
      const obj = { sku: '', name: '', salePrice: '' };
      obj.sku = product.id;
      obj.name = product.title;
      obj.salePrice = product.price;
      const cartItem = createCartItemElement(obj);
      document.querySelector('.cart__items').appendChild(cartItem);
    });
}

// prettier-ignore
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(button);
  button.addEventListener('click', (t) => addCart(t.target.parentNode.firstChild.innerText));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// prettier-ignore
function loadProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((response) => response.results)
    .then((arr) =>
      arr.forEach((product) => {
        const obj = { sku: '', name: '', image: '' };
        obj.sku = product.id;
        obj.name = product.title;
        obj.image = product.thumbnail;
        document
          .querySelector('.items')
          .appendChild(createProductItemElement(obj));
      }))
    .then(() => document.querySelector('.loading').remove())
    .catch((e) => console.log(e));
}

window.onload = function onload() {
  loadProducts();
};
