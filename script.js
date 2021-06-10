function getItensList() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((arr) => resolve(arr.results));
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function getItemInfo(itemID) {
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json())
    .then((arr) => resolve(arr));
  });
}

function removeCartItem(target) {
  return document.querySelector('.cart__items').removeChild(target);
}

function cartItemClickListener(target) {
  return target.addEventListener('click', () => removeCartItem(target));
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener(li));
  return li;
}

function insertCartItem(event) {
  const eventId = event.firstElementChild.innerText;
  getItemInfo(eventId).then((itemInfo) => {
    const newCartItemElement = createCartItemElement(itemInfo);
    return document.querySelector('.cart__items').appendChild(newCartItemElement);
  });
}

function addCartItemClickListener(target) {
  return target.addEventListener('click', () => insertCartItem(target));
}

function insertItens(itemElement) {
  const itensSection = document.querySelector('.items');
  return itensSection.appendChild(itemElement);
}

window.onload = function onload() {
 getItensList()
  .then((itensInfo) => itensInfo.forEach((itemInfo) => {
    const newItemElement = createProductItemElement(itemInfo);
    addCartItemClickListener(newItemElement);
    return insertItens(newItemElement);
  }));
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
