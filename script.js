const apiUrl = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

const fetchAPI = (url) => {
  const promise = new Promise((resolve, reject) => {
    if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=$computador') {
      fetch(url).then((response) => response.json().then((itemsList) => resolve(itemsList)));
    } else {
      reject(new Error('Incorrect API Endpoint'));
    }
  });
  return promise;
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

// n

const addItems = async () => {
  try {
    fetchAPI(apiUrl).then((response) => {
      const itemsList = response.results;
      for (let itemIndex = 0; itemIndex < itemsList.length; itemIndex += 1) {
        const { id, title, thumbnail } = itemsList[itemIndex];
        const item = { sku: id, name: title, image: thumbnail };
        appendItem(createProductItemElement(item));
      }
    });
  } catch (error) {
    console.log(error);
  }
};

window.onload = function onload() { 
  addItems();
};