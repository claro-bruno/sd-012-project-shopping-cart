const mercadoLivreURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

const getAPIJson = (requested) => {
  if (!requested) {
    throw new Error('Não foi possível obter o json');
  }
  return requested.json();
};

const appendJson = (jsonData) => {
  if (!jsonData) {
    throw new Error('Não foi possível atribuir o json');
  }
  const itemSection = document.querySelector('section.items');
  jsonData.results.forEach((components) => {
    itemSection.appendChild(createProductItemElement(components));
  });
};

window.onload = () => {
  fetch(mercadoLivreURL)
    .then(getAPIJson)
    .then(appendJson)
    .catch((apiError) => console.log(apiError));
};
