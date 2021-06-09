const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function saveLocalStorage() {
  const listMom = document.querySelector('ol.cart__items');
  localStorage.setItem('lista', listMom.innerHTML);
}

function checkIfSaved() {
  const listMom = document.querySelector('ol.cart__items');
  const backup = localStorage.getItem('lista');
  if (backup !== null) {
    listMom.innerHTML = backup;
  }
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

function createProductItemElement({
  sku,
  name,
  image,
}) {
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

function getButton(item) {
  return item.querySelector('button.item__add');
}

function cartItemClickListener(event) {
  if (event.className === 'cart__item') {
    const allItemsCart = document.querySelector('.cart__items');
    allItemsCart.removeChild(event);
    saveLocalStorage();
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const activateButtons = () => {
  const allSectionsProducts = document.querySelectorAll('.item');
  allSectionsProducts.forEach((item) => {
    const id = getSkuFromProductItem(item);
    const button = getButton(item);
    const urlItem = `https://api.mercadolibre.com/items/${id}`;
    button.addEventListener('click', () => {
      fetch(urlItem).then((data) => data.json()).then((file) => {
        const { id: sku, title: name, price: salePrice } = file;
        const cartProduct = createCartItemElement({ sku, name, salePrice });
        const cart = document.querySelector('.cart__items');
        cart.appendChild(cartProduct);
        saveLocalStorage();
      });
    });
  });
};

window.onload = async function computers() {
  const link = await fetch(url);
  const obj = await link.json();
  const resultados = await obj.results;
  resultados.forEach((product) => {
    const allItemsList = document.querySelector('.items');
    const { id: sku, title: name, thumbnail: image } = product;
    const newItem = createProductItemElement({ sku, name, image });
    allItemsList.appendChild(newItem);
  });
  checkIfSaved();
  activateButtons();
};

document.addEventListener('click', (event) => {
  if (event.target.className === 'cart__item') {
    cartItemClickListener(event.target);
  }
});
