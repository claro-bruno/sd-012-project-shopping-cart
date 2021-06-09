const API = "https://api.mercadolibre.com/sites/MLB/search?q=$computador";
const URL_PROD = "https://api.mercadolibre.com/items/";

// CARREGA LISTA DO LOCALSTORAGE
const temp = JSON.parse(localStorage.getItem('saved cart'));
if (temp != null){
  document.getElementById('cart').outerHTML = temp;
}

document.getElementById('emtpy-cart').addEventListener('click', () => {
  document.getElementById('cart').innerHTML = '';
});

// COLOCA OS PRODUTOS NA TELA
window.onload = async () => { 
  const products = await fetchProducts();
  products.forEach((product) => {
    document
    .querySelector('.items')
    .appendChild(createProductItemElement(product));
  });
}

// BUSCA PELA API TODOS OS PRODUTOS QUE VAO NA TELA PRINCIPAL
const fetchProducts = () => (
  new Promise((resolve, reject) => {
    fetch(API)
    .then(response => response.json())
    .then(data => resolve(data.results))
    .catch(fail => reject('Bugou'));
  })
);

// BUSCA PELA API O PRODUTO SELECIONADO
const fetchProduct = (url) => (
  new Promise((resolve, reject) => {
    fetch(url)
    .then(response => response.json())
    .then(data => resolve(data))
    .catch(fail => reject('Bugou'));
  })
);

// FUNCAO USADA AO CLICAR NO BOTAO 'ADICIONAR AO CART'
const addToCart = async (targetParent) => {
  const item = getSkuFromProductItem(targetParent);
  const url = URL_PROD + item;
  const product = await fetchProduct(url);
  document
  .querySelector('.cart__items')
  .appendChild(createCartItemElement(product));
  saveList();
}

// FUNCAO QUE SALVA O ESTADO ATUAL DA LISTA
function saveList(){
  const list = document.getElementById('cart').outerHTML;
  const temp = JSON.stringify(list);
  localStorage.setItem('saved cart', temp);
}










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
  if (element == 'button'){
    e.addEventListener('click', (event) => {
      const item = event.target.parentElement;
      addToCart(item);
    })
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveList();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

