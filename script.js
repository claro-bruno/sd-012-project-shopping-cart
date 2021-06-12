const classItem = document.querySelector('.items');
const classCartItem = document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

async function selectItem(id) {
  const urlIdAPI = `https://api.mercadolibre.com/items/${id}`;
  try {
    const requiredId = await fetch(urlIdAPI);
    const resultId = await requiredId.json();
    const itemSelect = createCartItemElement(resultId);
    document.getElementsByClassName('cart__items')[0].appendChild(itemSelect);
  } catch (error) {
    return error;
  }
}

// A função abaixo foi implementada com auxílio do repositório do Ryan Laiber.

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', (event) => {
      const id = event.target.parentElement.firstChild.innerText;
      selectItem(id); 
    });
  }
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

const loadItems = (computerItem) => {
  computerItem.forEach((element) => {
    classItem.appendChild(createProductItemElement(element));
  });
};

async function getItems(itemName, showItem) {
  const urlAPI = `https://api.mercadolibre.com/sites/MLB/search?q=${itemName}`;  
  try {
    const requiredItems = await fetch(urlAPI);
    const { results } = await requiredItems.json();
    showItem(results);
  } catch (error) {
    return error;
  }
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() { 
  getItems('computer', loadItems);
};
