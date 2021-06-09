const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

const getApiObject = async (url) => {
  const response = await fetch(url);
  return response.json();
};

function appendItem(item) {
  const itemsContainer = document.querySelector('.items');
  itemsContainer.appendChild(item);
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

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

const addItems = async () => {
  try {
    const itemsList = (await getApiObject(apiUrl)).results;
    itemsList.forEach((itemObj) => {
      const { id, title, thumbnail } = itemObj;
      const item = { sku: id, name: title, image: thumbnail };
      appendItem(createProductItemElement(item));
    });
  } catch (error) {
    console.log(error);
  }
};

window.onload = function onload() { 
  getApiObject(apiUrl).then(addItems);
};