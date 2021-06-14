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
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getFetchML = async () => {
  const items = document.querySelector('.items');
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  const ob = await response.json();
  const result = ob.results;
  return result.forEach((computer) => {
    items.appendChild(createProductItemElement(computer));
  })
}

const fetchID = async (id) => {
  const ol = document.querySelector('.cart__items');
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const ob = await response.json();
  ol.appendChild(createCartItemElement(ob));
};

const addButtonCart = () => {
  const buttonCart = document.querySelectorAll('.item__add');
  buttonCart.forEach((button) => {
    button.addEventListener('click', () => {
      const getID = button.parentNode.firstChild.innerText;
      fetchID(getID)
    });
  });
};

const clearShop = () => {
  const clearButtonCart = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  clearButtonCart.addEventListener('click', () => {
    ol.innerHTML = '';
  });
};

window.onload = async function onload() {
  await getFetchML();
  await addButtonCart();
  await clearShop();

 };