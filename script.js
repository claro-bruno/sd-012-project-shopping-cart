const totalPrice = [];

function totalCalc() {
  const total = totalPrice.reduce((acc, curr) => acc + curr, 0);
  document.querySelector('.total-price').innerText = `${total}`;
}

async function cartItemClickListener(event) {
  const erasePrice = event.target.innerText.split('$')[1] * -1;
  totalPrice.push(erasePrice);
  await event.target.remove();
  await totalCalc();
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
      totalPrice.push(product.price);
      const obj = { sku: '', name: '', salePrice: '' };
      obj.sku = product.id;
      obj.name = product.title;
      obj.salePrice = product.price;
      const cartItem = createCartItemElement(obj);
      document.querySelector('.cart__items').appendChild(cartItem);
    })
    .then(() => totalCalc());
}



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



function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {

 };
