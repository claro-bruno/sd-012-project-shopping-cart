// Salvar Local Storage
const saveLocalStorage = () => {
  localStorage.setItem('cart', (document.querySelector('.cart__items').innerHTML));
  // eslint-disable-next-line sonarjs/no-duplicate-string
  localStorage.setItem('total', (document.querySelector('.total-price').innerHTML));
};

// Código baseado no código do colega Rodrigo Merlon turma 12
// Update Price
const updatePrice = (price) => {
  const totalPrice = document.querySelector('.total-price');
  if (price === 0) totalPrice.innerHTML = 0;
  const currentPrice = Number(totalPrice.innerHTML);
  totalPrice.innerHTML = Math.round((price + currentPrice) * 100) / 100;
};

// Remove Item do cart
function cartItemClickListener(event) {
  const string = event.target.innerHTML;
  const price = Number(string.split('$')[1]);
  updatePrice(-price);
  event.target.remove();
  saveLocalStorage();
}

// Cria o elemento para adicionar ao carrinho
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.id = id;
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Gera a Promise do ComputadorID
const getComputerIDPromise = (computerID) => new Promise((resolve, reject) => {
  if (computerID === undefined) {
    reject(new Error('ID Errado'));
  } else {
    fetch(`https://api.mercadolibre.com/items/${computerID}`)
    .then((response) => {
      response.json().then((computer) => {
        const cart = document.querySelector('ol');
        cart.appendChild(createCartItemElement(computer));
        updatePrice(computer.price);
        // salvar no local storage
        saveLocalStorage();
        resolve();
      });
    });
  }
}); 

// Função para Adicionar item ao carrinho
const addToShoppingCart = (event) => {
  const id = event.target.parentNode.firstChild.innerHTML;
  return getComputerIDPromise(id);
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
  if (element === 'button') e.addEventListener('click', addToShoppingCart);
  e.innerText = innerText;

  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Tela de Loading
const Loading = (create) => {
  if (create === true) {
    const loadingSection = document.createElement('div');
    loadingSection.className = 'loadingModal';
    document.querySelector('body').appendChild(loadingSection);
    const div = document.createElement('div');
    div.className = 'loading';
    div.innerHTML = 'Carregando...';
    loadingSection.appendChild(div);
  } else {
    document.querySelector('.loadingModal').remove();
  }
};

// Gera a Promise do Computador
const getComputerPromise = (computerName) => new Promise((resolve, reject) => {
  Loading(true);
  if (computerName !== 'computador') {
    reject(new Error('Nome Errado'));
  } else {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computerName}`)
    .then((response) => {
      response.json().then((computer) => {
        const sectionPai = document.querySelector('.items');

        computer.results.map((computerUnit) => sectionPai
          .appendChild(createProductItemElement(computerUnit)));    

        Loading(false);
        resolve();
      });
    });
  }
});

// fetch Computer
const fetchComputer = async () => {
  try {
    await getComputerPromise('computador');
  } catch (error) {
    console.log(error);
  }
};

// Limpa carrinho de compras
const eraseCart = () => {
  const cart = document.querySelector('ol');
  cart.innerHTML = '';
  updatePrice(0);
  localStorage.clear();
};

// Carrega o local Storage
const reloadCart = () => {
  document.querySelector('.total-price').innerHTML = localStorage.getItem('total');
  document.querySelector('ol').innerHTML = localStorage.getItem('cart');
  const listItens = document.querySelectorAll('.cart__item');
  return listItens.forEach((item) => item.addEventListener('click', cartItemClickListener));
};

window.onload = function onload() {
  fetchComputer();
  reloadCart();
  document.querySelector('.empty-cart').addEventListener('click', eraseCart);
};