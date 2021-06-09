const listURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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
  const parentElement = document.querySelector('.cart__items');
  parentElement.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const appendItem = (element, parentClass) => {
  const parentElement = document.querySelector(parentClass);

  parentElement.appendChild(element);
};

const fetchSomething = async (URL) => {
  const fetchObject = fetch(URL)
    .then((response) => response
      .json()
      .then((object) => object));
  
  return fetchObject;
};

const createItemList = async (itemList) => itemList
  .forEach((item) => appendItem(createProductItemElement(item), '.items'));

const addButtonEvent = async () => {
  const itemList = document.querySelectorAll('.item');
  
  itemList.forEach((item) => {
    const button = item.querySelector('button');
    // console.log(button);
    // addItemToCart(item);
    button.addEventListener('click', async () => {
      const itemID = getSkuFromProductItem(item);
      const itemObj = await fetchSomething(`https://api.mercadolibre.com/items/${itemID}`);
      const itemLi = createCartItemElement(itemObj);
      appendItem(itemLi, '.cart__items');
    });
  });
};

const asyncFuncList = async () => {
  try {
    const fetchedObject = await fetchSomething(listURL);
    const productList = fetchedObject.results;
    await createItemList(productList);
    await addButtonEvent();
  } catch (error) {
    console.log('Error');
  }
};

window.onload = function onload() {
  asyncFuncList();
};
