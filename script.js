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

const nameKey = 'cartItem';
let array = [];

// Funcção para salvar itens no local storage
const saveItem = (item) => {
  if (typeof (item) === 'string') array.push(item);
  localStorage.setItem(nameKey, JSON.stringify(array));
};

// Função para remover item do carrinho
function cartItemClickListener(e) {
  const liText = e.target.innerText;
  e.target.remove();
  array = array.filter((item) => item !== liText);
  saveItem();
}

/* Função não utilizada
function getSkuFromProductItem(item) {
   return item.querySelector('span.item__sku').innerText;
 }
*/

// Função para criar elementos no carrinho
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  const liText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.innerText = liText;
  li.addEventListener('click', cartItemClickListener);
  saveItem(liText);

  return li;
}

const addCartItemElement = (text) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = text;
  li.addEventListener('click', cartItemClickListener);

  return li;
};

// Função que encontra o Id na API
const fetchId = (sku) => {
  const cart = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((response) => {
      cart.appendChild(createCartItemElement(response));
      // saveItem(response);
    })
    .catch((error) => (error));
};

// Função que cria lista de produtos
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  // Para adicionar o evento na criação do botão tive ajuda do Emerson Filho!
  button.addEventListener('click', () => { 
    fetchId(sku);
  });
  section.appendChild(button);

  return section;
}

// Função que carrega os itens salvos, no carrinho
const loadItems = () => {
  const cartItem = localStorage.getItem(nameKey);
  const cartItemString = JSON.parse(cartItem);
  if (cartItemString !== null) {
    array = cartItemString;
    cartItemString.forEach((item) => {
      const cart = document.querySelector('.cart__items');
      cart.appendChild(addCartItemElement(item));
    });
  }
};

// Função que encontra a API do ML
const getMLProducts = () => new Promise((resolve, reject) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((response) => resolve(response))
    .catch((error) => reject(error));
});

window.onload = function onload() { 
  getMLProducts()
    .then((response) => response.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
      const list = document.querySelector('.items');
       list.appendChild(createProductItemElement({ sku, name, image }));
    }))
    .catch((error) => error);

  loadItems();
};
