let total = 0;

const updateLocalStorage = () => {
  localStorage.setItem('cart', document.getElementsByClassName('cart__items').innerHTML);
  localStorage.setItem('total', total);
};

const loadLocalStorage = () => {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  document.querySelector('.total-price').innerHTML = localStorage.getItem('total');
};

const updateTotal = () => {
  document.querySelector('.total-price').innerHTML = total;
  updateLocalStorage();
};

const insertLoading = () => {
  const section = document.createElement('section');
  section.innerHTML = 'Loading...';
  section.className = 'loading';
  document.querySelector('.items').appendChild(section);
};

const removeLoading = () => {
  document.querySelector('.loading').remove();
};

function cartItemClickListener(event) {
  total -= Number(event.target.id) / 2;
  event.target.remove();
  updateTotal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = `${salePrice}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  total += salePrice;
  updateTotal();
  return li;
}

const fetchItemPrice = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`).then((response) => {
    response.json().then((item) => {
      const cartSection = document.querySelector('.cart__items');
      cartSection.appendChild(createCartItemElement(item));
      updateLocalStorage();
    });
  });
};

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

const createItemsList = (searchTerm) => {
  insertLoading();
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`).then((response) => {
    response.json().then((itemList) => {
      removeLoading();
      itemList.results.forEach((specificItem) => {
        const itemsSection = document.querySelector('.items');
        itemsSection.appendChild(createProductItemElement(specificItem));
      });
    });
  });
};

document.addEventListener('click', (event) => {
  if (event.target.className === 'item__add') {
    fetchItemPrice(getSkuFromProductItem(event.target.parentElement));
  }
  // if (event.target.className === 'cart__item') {
  //   cartItemClickListener(event);
  // }
  if (event.target.className === 'empty-cart') {
    document.getElementsByClassName('gitcart__items').innerHTML = '';
    total = 0;
    updateTotal();
    updateLocalStorage();
  }
});

window.onload = function onload() {
  createItemsList('computador');
  loadLocalStorage();
};