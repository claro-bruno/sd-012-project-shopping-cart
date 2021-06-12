const itemList = document.querySelector('ol.cart__items');
const priceDisplay = document.querySelector('#price-span');

const strinListaProdutos = 'lista-produtos';
const valorProdutos = 'valor-produtos';

let pricesArray = [];

const getAPIJson = async (urlAPI) => {
  const fetchAPI = await fetch(urlAPI);
  return fetchAPI.json();
};

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
  event.target.remove();
  localStorage.setItem(`${strinListaProdutos}`, itemList.innerHTML);
}

function gettingPrice(event) {
  const liText = event.target.innerText;

  const indexOfNumber = pricesArray.indexOf(parseFloat(liText.match(/\d+.\d+$/gm)[0]));

  pricesArray.splice(indexOfNumber, 1);

  if (pricesArray.length === 0) {
    priceDisplay.innerHTML = '0';
  } else {
    priceDisplay.innerHTML = pricesArray.reduce((acc, curr) => acc + curr);
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
  const listStorage = event.innerHTML;
  localStorage.setItem(`${strinListaProdutos}`, listStorage);
};

const fetchButton = async (productURL) => {
  const eachProdJson = await getAPIJson(productURL);
  itemList.appendChild(createCartItemElement(eachProdJson));
  pricesArray.push(eachProdJson.base_price);
  saveList(itemList);
  localStorage.setItem(`${valorProdutos}`, pricesArray);
};

const buttonEvents = async () => {
  const allButtons = document.querySelectorAll('button.item__add');

  allButtons.forEach((item) => {
    item.addEventListener('click', (evt) => {
      const productText = evt.target.parentNode.firstChild.innerText;
      const productURL = `https://api.mercadolibre.com/items/${productText}`;
      fetchButton(productURL);
    });
  });
};

const displayAPIData = async (requested) => {
  const itemSection = document.querySelector('section.items');
  itemSection.firstChild.remove();

  const jsonInput = await requested;
  jsonInput.results.forEach((components) => {
    itemSection.appendChild(createProductItemElement(components));
  });
};

const returnSavedList = () => {
  itemList.innerHTML = localStorage.getItem(`${strinListaProdutos}`);
  itemList.childNodes.forEach((item) => item.addEventListener('click', cartItemClickListener));
  itemList.childNodes.forEach((item) => item.addEventListener('click', gettingPrice));

  if (!localStorage.getItem(`${valorProdutos}`)) {
    priceDisplay.innerHTML = '0';
  } else {
    pricesArray = localStorage.getItem(`${valorProdutos}`).split(',');
    const dkqowe = pricesArray.map((xablinho) => Number(xablinho));
    priceDisplay.innerHTML = dkqowe.reduce((acc, curr) => acc + Number(curr), 0);
    pricesArray = dkqowe;
  }
};

const clearButton = () => {
  const button = document.querySelector('button.empty-cart');
  button.addEventListener('click', () => {
    itemList.innerHTML = '';
    localStorage.clear();
  });
};

window.onload = async () => {
  await displayAPIData(getAPIJson('https://api.mercadolibre.com/sites/MLB/search?q=computador'));
  buttonEvents();
  returnSavedList();
  clearButton();
};
