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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const fetchAPI = () => {
  const sectionItens = document.querySelector('.items');
  const produtos = fetch(API_URL)
    .then((response) => response.json())
    .then((response) => response.results.forEach((produto) => {
      sectionItens.appendChild(createProductItemElement(produto));
  }));
  return produtos;
};

const addItemToCart = () => {
  const botoesAdd = document.querySelectorAll('.item__add');
  botoesAdd.forEach((botao) => botao.addEventListener('click', () => {
    const idProduto = botao.parentNode.firstChild.innerText;
    const carrinho = document.querySelector('.cart__items');
    return fetch(`https://api.mercadolibre.com/items/${idProduto}`)
    .then((response) => response.json())
    .then((produto) => carrinho.appendChild(createCartItemElement(produto)));
  }));
};

window.onload = function onload() {
  fetchAPI()
    .then(() => addItemToCart());
};