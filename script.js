window.onload = function onload() { 
  getPc();

  const ol = document.querySelector('.cart__items');
  if (localStorage.getItem('cartItens')) {
    ol.innerHTML = JSON.parse(localStorage.getItem('cartItens'));
  }
  const limpar = document.querySelector('.empty-cart');
  limpar.addEventListener('click', () => {
    ol.innerHTML = '';
    if (localStorage.getItem('cartItens')) {
      localStorage.removeItem('cartItens');
    }
  })
  
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
const getPc = () => {
  const loading = document.createElement('p');
  loading.innerText = 'loading...';
  loading.className = 'loading';
  const section = document.querySelector('.items');
  section.appendChild(loading);
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador').then((response) => {
    response.json().then((computador) => {
      section.removeChild(loading);
    computador.results.forEach(({id: sku, title: name, thumbnail: image}) => 
    section.appendChild(createProductItemElement({sku, name, image})));
    })
  })
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botao.addEventListener('click', () => adicionarCarr(section))
  section.appendChild(botao);
  return section;
}
async function adicionarCarr(item) {
  const id = getSkuFromProductItem(item);
  let produto = await fetch(`https://api.mercadolibre.com/items/${id}`);
    produto = await produto.json();
    const {id: sku, title: name, price: salePrice} = produto;
    const ol = document.querySelector('.cart__items');
    ol.appendChild(createCartItemElement({sku, name, salePrice}));
    localStorage.setItem('cartItens', JSON.stringify(ol.innerHTML));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
  localStorage.setItem('cartItens', JSON.stringify(ol.innerHTML));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

