const mercadoLivreURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const stringOrderedList = 'ol.cart__items';
const strinListaProdutos = 'lista-produtos';

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
  const itemList = document.querySelector(stringOrderedList);

  event.target.remove();
  localStorage.setItem(`${strinListaProdutos}`, itemList.innerHTML);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const saveList = (event) => {
  const productID = event.parentNode.innerHTML;
  localStorage.setItem(`${strinListaProdutos}`, productID);
};

const buttonListener = () => {
  const allButtons = document.querySelectorAll('button.item__add');
  let itemCode = '';
  allButtons.forEach((item) => {
    item.addEventListener('click', (evt) => {
      const itemList = document.querySelector(stringOrderedList);
      itemCode = evt.target.parentNode.firstChild.innerText;
      const productURL = `https://api.mercadolibre.com/items/${itemCode}`;
      fetch(productURL)
        .then((response) => response.json())
        .then((data) => itemList.appendChild(createCartItemElement(data)))
        .then((eachProduct) => saveList(eachProduct));
    });
  });
};

const getAPIJson = (requested) => {
  // error style learned from Roger Melo youtube channel
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

const returnSavedList = () => {
  const itemList = document.querySelector(stringOrderedList);

  itemList.innerHTML = localStorage.getItem(`${strinListaProdutos}`);
  itemList.childNodes.forEach((item) => item.addEventListener('click', cartItemClickListener));
};

window.onload = async () => {
  try {
    const getJson = await fetch(mercadoLivreURL);
    await getAPIJson(getJson).then(appendJson);
    buttonListener();
    returnSavedList();
  } catch (error) {
    console.log(`Não foi possível obter o json ${error}`);
  }
};
