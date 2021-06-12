const stringOrderedList = 'ol.cart__items';
const strinListaProdutos = 'lista-produtos';
const priceSpanString = '#price-span';
const valorProdutos = 'valor-produtos';

let pricesArray = [];

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
  const img = image.replace(/-I.jpg/g, '-O.jpg');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(img));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function cartItemClickListener(event) {
  const itemList = document.getElementsByClassName('cart__items');
  event.target.remove();
  localStorage.setItem(`${strinListaProdutos}`, itemList.innerHTML);
}

function gettingPrice(event) {
  const priceSpan = document.querySelector(priceSpanString);

  const liText = event.target.innerText;

  const indexOfNumber = pricesArray.indexOf(parseFloat(liText.match(/\d+.\d+$/gm)[0]));

  pricesArray.splice(indexOfNumber, 1);

  if (pricesArray.length === 0) {
    priceSpan.innerHTML = '0';
  } else {
    priceSpan.innerHTML = pricesArray.reduce((acc, curr) => acc + curr);
  }
  localStorage.setItem(`${valorProdutos}`, pricesArray);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', gettingPrice);
  return li;
}

const saveList = (event) => {
  const productID = event.parentNode.innerHTML;
  localStorage.setItem(`${strinListaProdutos}`, productID);
};

const fetchButton = (itemList, productURL, priceSpan) => {
  fetch(productURL)
    .then((response) => response.json())
    .then((data) => itemList.appendChild(createCartItemElement(data)))
    .then((eachProduct) => {
      const productText = eachProduct.innerText;
      saveList(eachProduct);
      pricesArray.push(parseFloat(productText.match(/\d+.\d+$/gm)[0]));
      priceSpan.innerHTML = pricesArray.reduce((acc, curr) => acc + curr);
      localStorage.setItem(`${valorProdutos}`, pricesArray);
    });
};

// eslint-disable-next-line max-lines-per-function
const buttonListener = () => {
  const allButtons = document.querySelectorAll('button.item__add');
  const priceSpan = document.querySelector(priceSpanString);
  let itemCode = '';
  allButtons.forEach((item) => {
    item.addEventListener('click', (evt) => {
      const itemList = document.querySelector(stringOrderedList);
      itemCode = evt.target.parentNode.firstChild.innerText;
      const productURL = `https://api.mercadolibre.com/items/${itemCode}`;
      fetchButton(itemList, productURL, priceSpan);
    });
  });
};

const jsonAppend = async (requested) => {
  // error style learned from Roger Melo youtube channel
  if (!requested) {
    throw new Error('Não foi possível entrar em contato com a API');
  }
  const itemSection = document.querySelector('section.items');
  itemSection.firstChild.remove();

  const jsonData = await requested.json();
  jsonData.results.forEach((components) => {
    itemSection.appendChild(createProductItemElement(components));
  });
};

const returnSavedList = () => {
  const itemList = document.querySelector(stringOrderedList);
  const priceSpan = document.querySelector(priceSpanString);

  itemList.innerHTML = localStorage.getItem(`${strinListaProdutos}`);
  itemList.childNodes.forEach((item) => item.addEventListener('click', cartItemClickListener));
  itemList.childNodes.forEach((item) => item.addEventListener('click', gettingPrice));

  if (!localStorage.getItem(`${valorProdutos}`)) {
    priceSpan.innerHTML = '0';
  } else {
    pricesArray = localStorage.getItem(`${valorProdutos}`).split(',');
    const dkqowe = pricesArray.map((xablinho) => Number(xablinho));
    priceSpan.innerHTML = dkqowe.reduce((acc, curr) => acc + Number(curr), 0);
    pricesArray = dkqowe;
  }
};

const clearButton = () => {
  const button = document.querySelector('button.empty-cart');
  button.addEventListener('click', () => {
    const itemList = document.querySelector(stringOrderedList);
    itemList.innerHTML = '';
    localStorage.clear();
  });
};

window.onload = async () => {
  const fetchCatalog = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  await jsonAppend(fetchCatalog);
  buttonListener();
  returnSavedList();
  clearButton();
};
