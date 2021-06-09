const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function saveLocalStorage() {
  const totalPrice = document.querySelector('span.total-price');
  const listMom = document.querySelector('ol.cart__items');
  localStorage.setItem('lista', listMom.innerHTML);
  localStorage.setItem('total', totalPrice.innerHTML);
}

function checkIfSaved() {
  const totalPrice = document.querySelector('span.total-price');
  const listMom = document.querySelector('ol.cart__items');
  const priceBackup = localStorage.getItem('total');
  const backup = localStorage.getItem('lista');
  if (backup !== null) {
    listMom.innerHTML = backup;
    totalPrice.innerHTML = priceBackup;
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
    const splitMoney = event.innerHTML.split('$');
    const value = splitMoney[splitMoney.length - 1];
    const totalPrice = document.querySelector('.total-price');
    totalPrice.innerHTML = parseFloat(totalPrice.innerHTML) - parseFloat(value);
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

function clear() {
  const limparTudo = document.querySelector('.empty-cart');
  limparTudo.addEventListener('click', () => {
    const numberChild = document.querySelectorAll('li').length;
    const olList = document.querySelector('ol');
    for (let i = 0; i < numberChild; i += 1) {
      const child = document.querySelector('li');
      olList.removeChild(child);
    }
    const price = document.querySelector('div span.total-price');
    price.innerHTML = 0;
    saveLocalStorage();
  });
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
        const totalPrice = document.querySelector('.total-price');
        totalPrice.innerHTML = parseFloat(totalPrice.innerHTML) + salePrice;
        saveLocalStorage();
      });
    });
  });
  clear();
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
