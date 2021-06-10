const API = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const URL_PROD = 'https://api.mercadolibre.com/items/';

// FUNCAO QUE SALVA O ESTADO ATUAL DA LISTA
const saveList = () => {
  const list = document.getElementById('cart').outerHTML;
  const temp = JSON.stringify(list);
  localStorage.setItem('saved cart', temp);
};

// ATUALIZA O PRECO TOTAL DA LISTA
const updateTotalPrice = () => {
  let str = document.getElementById('cart').innerHTML;  
  let end = str.indexOf('</li>');
  let start = str.indexOf('PRICE: $') + 8;
  let substr;    
  const totals = [];  
  if (end > 0) {
    while (end > 0) { 
      substr = str.substring(start, end);
      totals.push(Number(substr));
      str = str.replace('</li>', '');
      str = str.replace('PRICE: $', '');
      start = str.indexOf('PRICE: $') + 8;
      end = str.indexOf('</li>');
    }
  }  
  const total = totals.reduce((acc, item) => acc + item, 0);
  document.getElementById('total-price').innerHTML = total;
};

// PEGA ID
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// FUNCAO DO EVENT LISTENER DOS ITENS DA LISTA
function cartItemClickListener(event) {
  event.target.remove();
  updateTotalPrice();
  saveList();
}

// FUNCAO AUXILIAR PARA CRIAR OS CARDS
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// BUSCA PELA API TODOS OS PRODUTOS QUE VAO NA TELA PRINCIPAL
const fetchProducts = () => (
  new Promise((resolve, reject) => {
    fetch(API)
    .then((response) => response.json())
    .then((data) => resolve(data.results))
    .catch(() => reject('Bugou'));
  })
);

// BUSCA PELA API O PRODUTO SELECIONADO
const fetchProduct = (url) => (
  new Promise((resolve, reject) => {
    fetch(url)
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch(() => reject('Bugou'));
  })
);

// FUNCAO USADA AO CLICAR NO BOTAO 'ADICIONAR AO CART'
const addToCart = (targetParent) => {
  const item = getSkuFromProductItem(targetParent);
  const url = URL_PROD + item;
  fetchProduct(url)
  .then((product) => {
    document
    .querySelector('.cart__items')
    .appendChild(createCartItemElement(product));
  })
  .then(() => {
    updateTotalPrice();
    saveList();
  });
};

// EVENT LISTENER - ESVAZIAR CARRINHO
document.getElementById('emtpy-cart').addEventListener('click', () => {
  document.getElementById('cart').innerHTML = '';
  updateTotalPrice();
  saveList();
});

// FUNCAO SECUNDARIA - CRIA IMAGEM
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// FUNCAO SECUNDARIA - CRIA ELEMENTO
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', (event) => {
      const item = event.target.parentElement;
      addToCart(item);
    });
  }
  return e;
}

// CRIA BOX DO PRODUTO HTML
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// CARREGA LISTA DO LOCALSTORAGE*************************************************
const storageContent = JSON.parse(localStorage.getItem('saved cart'));
if (storageContent != null) {
  document.getElementById('cart').outerHTML = storageContent;
  const lista = document.getElementById('cart');
  for (let i = 0; i < lista.children.length; i += 1) {
    lista.children[i].addEventListener('click', cartItemClickListener);
  }
}
updateTotalPrice();

// COLOCA OS PRODUTOS NA TELA
window.onload = async () => { 
  const products = await fetchProducts();
  products.forEach((product) => {
    document
    .querySelector('.items')
    .appendChild(createProductItemElement(product));
  });
}; // *******************************************************************
