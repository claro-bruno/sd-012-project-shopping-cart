window.onload = function onload() { };

const sectionItens = document.getElementsByClassName('items')[0];

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

const getItemListFromStorage = () => {
  let itemList = localStorage.getItem('itemList');
  if (!itemList) {
    itemList = [];
  } else {
    itemList = JSON.parse(itemList);
  }
  return itemList;
};

const fetchItens = async () => {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((list) => {
      const listComputer = list.results;
      listComputer.forEach((element) => {
        const { id, title, thumbnail } = element;
        const item = {
          sku: id,
          name: title,
          image: thumbnail,
        };
        sectionItens.appendChild(createProductItemElement(item));
      });
    });
};

const setItemListToStorage = (itemList) => {
  localStorage.setItem('itemList', JSON.stringify(itemList));
};

const saveLocalCart = (itemInfo) => {
  const itemList = getItemListFromStorage();
  itemList.push(itemInfo);
  setItemListToStorage(itemList);
};

function cartItemClickListener(event, sku) {
  event.target.remove();
  const itemList = getItemListFromStorage();
  const newList = itemList.filter((item) => item.sku !== sku);
  setItemListToStorage(newList);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    cartItemClickListener(event, sku);
  });
  return li;
}

const addItemToCart = (itemInfo) => {
  const olCart = document.querySelector('.cart__items');
  const liItem = createCartItemElement(itemInfo);
  olCart.appendChild(liItem);
};

const addEventButton = (button, index) => {
  const idListAdd = document.getElementsByClassName('item__sku');
  button.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${idListAdd[index].innerText}`)
      .then((response) => response.json())
      .then((itemInfo) => {
        const { id, title, price } = itemInfo;
        const individualItem = {
          sku: id,
          name: title,
          salePrice: price,
        };
        addItemToCart(individualItem);
        saveLocalCart(individualItem);
      });
  });
};

const addProductsButtonListeners = async () => {
  await fetchItens();
  const buttonListAdd = document.getElementsByClassName('item__add');
  for (let index = 0; index < buttonListAdd.length; index += 1) {
    addEventButton(buttonListAdd[index], index);
  }
};

const initialLoad = () => {
  const itemList = getItemListFromStorage();
  console.log(itemList);
  itemList.forEach((item) => addItemToCart(item));
};

initialLoad();
addProductsButtonListeners();