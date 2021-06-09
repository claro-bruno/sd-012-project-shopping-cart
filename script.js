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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(/* event */) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addEvent = (event, callback) => {
  const itemAddButtons = document.getElementsByClassName('item__add');
  for (let index = 0; index < itemAddButtons.length; index += 1) {
    itemAddButtons[index].addEventListener(event, callback);
  }
};

const addCartItem = (event) => {
  const section = event.target.parentElement;
  const id = section.firstElementChild.innerHTML;
  const cartList = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${id}`).then((response) => {
    response.json().then((item) => {      
      cartList.appendChild(createCartItemElement(item));
    });
  });
};

const createList = () => {
  const itensSection = document.getElementsByClassName('items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then((response) => {
    response.json().then(({ results }) => {
      for (let index = 0; index < results.length; index += 1) {
        const newSection = createProductItemElement(results[index]);
        itensSection[0].appendChild(newSection);
      }
      addEvent('click', addCartItem);
    });
  });
};

window.onload = function onload() {
  createList();
};
