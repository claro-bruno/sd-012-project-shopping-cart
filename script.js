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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const saveCarrinho = () => {
  const allItems = document.querySelectorAll('.cart__item');
  const array = [];
  for (let i = 0; i < allItems.length; i += 1) {
    array.push(allItems[i].outerHTML);
  }

  localStorage.setItem('produtos', JSON.stringify(array));
}

const getResult = (results) => {
  const getItems = document.querySelector('.items');
  const objeto = {};
  results.forEach(({id, title, thumbnail}) => {
    objeto.sku = id;
    objeto.name = title;
    objeto.image = thumbnail;
    const product = createProductItemElement(objeto);
    getItems.appendChild(product);
  })
}

const getProducts = () => {
  const url = "https://api.mercadolibre.com/sites/MLB/search?q=$computador";
  fetch(url).then((response) => response.json())
  .then((result) => getResult(result.results))
  .then(() => getButton());
}

const addCarrinho = (results) => {
  const getListItems = document.querySelector('.cart__items');
  const objeto = {};
  objeto.sku = results.id;
  objeto.name = results.title;
  objeto.salePrice = results.price;
  const product = createCartItemElement(objeto);
  getListItems.appendChild(product);
  saveCarrinho();
}

const getItem = (ID) => {
  const url = `https://api.mercadolibre.com/items/${ID}`;
  fetch(url).then((response) => response.json())
  .then((result) => addCarrinho(result));
}

const getButton = () => {
  const getAllButtons = document.querySelectorAll('.item__add');
  getAllButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const ID = event.target.parentElement.firstChild.innerText;
      getItem(ID);
    })
  })
}

const loadCarrinho = () => {
  const getListItems = document.querySelector('.cart__items');
  const array = JSON.parse(localStorage.getItem('produtos'));
  if (array !== null) {
    for (let i = 0; i < array.length; i += 1) {
      getListItems.innerHTML += array[i];
    }
  }
}

window.onload = function onload() {
  getProducts();
  loadCarrinho();
  addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      event.target.remove();
    }
  })
};