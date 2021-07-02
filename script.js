const COMPUTER_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const ITEM_URL = 'https://api.mercadolibre.com/items/';
const stringCart = '.cart__items';

function sumTotal() {
  const listItems = document.querySelectorAll('.cart__item');
  const total = document.querySelector('.total-price');
  let sumItems = 0;
  listItems.forEach((item) => {
    sumItems += Number(item.innerText.split('$')[1]);
  });
  total.innerText = sumItems;
}

function cartAddLocalStore() { // Add elementos no localStore
  if (localStorage.length !== 0) {
    localStorage.removeItem('cart');
  }
  const itemCart = document.querySelector(stringCart).innerHTML;
  localStorage.setItem('cart', itemCart);  
}

function clearCart() { // Limpa o carrinho de compra 
  const clearBtn = document.querySelector('.empty-cart');
  const olItemsCart = document.querySelector('.cart__items');
  
  clearBtn.addEventListener('click', () => {
     olItemsCart.innerHTML = '';
     cartAddLocalStore();
     sumTotal();
  });
}

function facilityKeysComputer(computer) { // Retonorna as chaves do objeto com o valor pedido
    return {
      sku: computer.id,
      name: computer.title,
      image: computer.thumbnail,
    };
}

function createProductImageElement(imageSource) { // cria imagem
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // cria elementos customizados
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) { // Cria cada elemento do produto
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(event) { // Evento que remove os itens ao serem clicados
  if (event.target.classList.contains('cart__item')) {
  const itemTarget = event.target;
  const listCart = document.querySelector(stringCart);
  listCart.removeChild(itemTarget);
  cartAddLocalStore(); 
  sumTotal();
  // cartSavedLocalStore();
  }
}

function cartSavedLocalStore() { // Pega (get) no local Storage
  const getCart = document.querySelector(stringCart);
  if (localStorage.length !== 0) {
    getCart.innerHTML = localStorage.getItem('cart');
    const childrenGetCart = getCart.childNodes;
    childrenGetCart.forEach((child) => child.addEventListener('click', cartItemClickListener)); 
    sumTotal(); 
  }
} 

function createCartItemElement({ id: sku, title: name, price: salePrice }) { // gera as Li's dos produtos renderizados na tela
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const listCart = document.querySelector(stringCart);
  listCart.appendChild(li);
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return li; 
}

function renderNewComputers(newComputers) { // Função auxiliar fetch
  newComputers.forEach((newcomputer) => {
    const element = createProductItemElement(newcomputer);
    document.getElementsByClassName('items')[0]
    .appendChild(element);
  });
}

/* function getTotalPrice() {
  const totalPrice = document.querySelector('.total-price');
} */

const fetchComputer = () => { // Função auxiliar
  fetch(COMPUTER_URL)
  .then((response) => response.json())
  .then((computers) => computers.results.map((computer) => facilityKeysComputer(computer)))
  .then((newComputers) => renderNewComputers(newComputers))
  .then(() => document.querySelector('.loading').remove());
};

const fetchItemID = (id) => { // Função auxiliar
  fetch(`${ITEM_URL}${id}`)
  .then((response) => response.json())
  .then((results) => createCartItemElement(results))
  .then(() => cartAddLocalStore())
  .then(() => sumTotal());
  // .then(() => getTotalPrice());
};

const addToCart = () => { // adiciona no carrinho
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const localId = event.target.parentElement.firstElementChild.innerText;
      fetchItemID(localId); 
    } 
  });
};

window.onload = function onload() {
  fetchComputer();
  addToCart(); 
  cartSavedLocalStore(); 
  clearCart(); 
 };