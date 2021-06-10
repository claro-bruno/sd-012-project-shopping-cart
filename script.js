// Captura Elementos
const itemsSection = document.querySelector('.items');
const ol = document.querySelector('.cart__items');

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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchItem = async (event) => {
  try {
    const id = event.target.parentElement.firstChild.innerText;
    let response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    response = await response.json();
    const cartItem = createCartItemElement(response);
    ol.appendChild(cartItem);
  } catch (err) {
    throw new Error(err);
  }
}

const fetchProducts = async () => {
  try {
    let response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    response = await response.json();
    response = await response.results.forEach((computer) => {
      const item = createProductItemElement(computer);
      item.addEventListener('click', fetchItem);
      itemsSection.appendChild(item);
    });
  } catch (err) {
    throw new Error(err);
  }
};

window.onload = function onload() {
  fetchProducts();
};