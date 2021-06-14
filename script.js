function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  console.log(event);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

function appendOl(item) {
  const ol = document.querySelector('.cart__items');
  ol.appendChild(item);
}

async function addItemToCart(id) {
  const result = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const itemId = await result.json();
  appendOl(createCartItemElement(itemId));
}

function clickItem(event) {
  if (event.target.className === 'item__add') {
    addItemToCart(getSkuFromProductItem(event.target.parentElement));
  }
}

function appendProductItem(item) {
  const items = document.querySelector('.items');
  items.appendChild(item);
  
  items.addEventListener('click', clickItem);
}

const loadProductsAPI = async () => {
  try {
    const result = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const { results: computers } = await result.json();
    computers.forEach((computer) => {
      appendProductItem(createProductItemElement(computer));
    });
  } catch (error) {
    console.log(error);
  }
};

window.onload = async () => {
  loadProductsAPI();
};