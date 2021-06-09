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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  console.log(event);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 1

const getPromiseProducts = () => new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json().then((computer) => resolve(computer)));
  });

const addProductsToPage = (promise) => {
  const sectionItems = document.querySelector('.items');
  return promise.then((computer) => {
    computer.results.forEach((item) => {
      const { id: sku, title: name, thumbnail: image } = item;
      const sectionItem = createProductItemElement({ sku, name, image });
      sectionItems.appendChild(sectionItem);
    });
  });
};

// Requisito 2

const getPromiseItem = (itemId) => new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json().then((computer) => resolve(computer)));
  });

const addProductToCart = (promise) => {
  const cartItems = document.querySelector('.cart__items');
  promise.then((item) => {
    console.log(item);
    const { id: sku, title: name, price: salePrice } = item;
    const itemLi = createCartItemElement({ sku, name, salePrice });
    cartItems.appendChild(itemLi);
  });
};

const addToCart = () => {
  const itemsArray = Array.from(document.getElementsByClassName('item'));
  itemsArray.forEach((item) => {
    const sku = item.querySelector('.item__sku').innerText;
    const button = item.querySelector('.item__add');
    button.addEventListener('click', () => addProductToCart(getPromiseItem(sku)));
  });
};

window.onload = function onload() {
  addProductsToPage(getPromiseProducts()).then(() => addToCart());
 };
