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
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const items = document.getElementsByClassName('items');

const FreeMarket = async () => {
  let endpoint = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  endpoint = await endpoint.json();
  endpoint = await endpoint.results;
  endpoint.forEach((element) => {
    items[0].appendChild(createProductItemElement(element));
  });
};

const selectComputer = async (event) => {
  let endpoint = await fetch(`https://api.mercadolibre.com/items/${event}`);
  endpoint = await endpoint.json();
  const cart = document.getElementsByClassName('cart__items')[0];
  cart.appendChild(createCartItemElement(endpoint));
};

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('item__add')) {
    const IdItem = event.target.parentElement.firstChild.innerText;
    selectComputer(IdItem);
  }
});

window.onload = function onload() { 
  FreeMarket();
};
