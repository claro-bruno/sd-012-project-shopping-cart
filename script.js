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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
const classeSpan = '.total-price';
const span = document.querySelector(classeSpan);
function sub(valor) {
  if (localStorage.getItem('total')) {
    let subPreco = Number(span.innerHTML);
    subPreco -= Number(valor);
    span.innerHTML = subPreco;
    localStorage.setItem('total', Number(subPreco));
  } else {
    let subPreco = 0;
    subPreco -= valor;
    span.innerHTML = subPreco;
  }
}  
const classeOl = '.cart__items';
const ol = document.querySelector(classeOl);
function cartItemClickListener(event) {
  sub((event.target).innerText.split('$')[1]);
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

function soma(valor) {
  if (localStorage.getItem('total')) {
    span.innerHTML = localStorage.getItem('total');
    let somaPreco = Number(span.innerHTML);
    somaPreco += Number(valor);
    span.innerHTML = somaPreco;
  } else {
    let somaPreco = 0;
    somaPreco += valor;
    span.innerHTML = somaPreco;
  }
}

async function adicionarCarr(item) {
  const id = getSkuFromProductItem(item);
  let produto = await fetch(`https://api.mercadolibre.com/items/${id}`);
  produto = await produto.json();
  const { id: sku, title: name, price: salePrice } = produto;
  ol.appendChild(createCartItemElement({ sku, name, salePrice }));
  localStorage.setItem('cartItens', JSON.stringify(ol.innerHTML));
  soma(salePrice);
  localStorage.setItem('total', Number(span.innerHTML));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botao.addEventListener('click', () => adicionarCarr(section));
  section.appendChild(botao);
  return section;
}

function getPc() {
  const loading = document.createElement('p');
  loading.innerText = 'loading...';
  loading.className = 'loading';
  const section = document.querySelector('.items');
  section.appendChild(loading);
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador').then((response) => {
    response.json().then((computador) => {
      section.removeChild(loading);
      computador.results.forEach(({ id: sku, title: name, thumbnail: image }) => 
      section.appendChild(createProductItemElement({ sku, name, image })));
    });
  });
}

window.onload = function onload() { 
    getPc();
    span.innerText = localStorage.getItem('total');
    if (localStorage.getItem('cartItens')) {
      ol.innerHTML = JSON.parse(localStorage.getItem('cartItens'));
    }
    const limpar = document.querySelector('.empty-cart');
    limpar.addEventListener('click', () => {
      ol.innerHTML = '';
      span.innerHTML = 'TOTAL R$ 0,00';
      if (localStorage.getItem('cartItens')) {
        localStorage.removeItem('cartItens');  
        localStorage.removeItem('total');
      }
    });
  };