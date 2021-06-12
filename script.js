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

const saveLocalStorage = () => {
  const produtosCarrinho = document.getElementsByClassName('cart__items');
  localStorage.setItem('cart', produtosCarrinho[0].innerHTML);
  // Estava salvando a própria OL na localStorage e não o conteúdo innerHTML dela, assim dando erro, consegui graças a ajuda do Nuwanda
};

const totalPrice = () => {
  const totalPriceCart = document.querySelector('.total-price');
  const produtosCarrinho = Object.values(document.getElementsByClassName('cart__item'));
  if (produtosCarrinho.length === 0) {
    totalPriceCart.innerText = 0;
  }
  let valorFinal = 0;
  produtosCarrinho.forEach((produto) => {
    const { innerText } = produto;
  const price = parseFloat(innerText.substring(innerText.indexOf('$') + 1));
  //  Método para pegar os caracteres a partir do $ na string visto no link https://bit.ly/2SucULQ
    valorFinal += price;
  });
  totalPriceCart.innerText = valorFinal;
};

function cartItemClickListener(event) {
  event.target.remove();
  totalPrice();
  saveLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//  Loader feito com auxílio dos colegas Marcos Siqueira e Nuwanda, pois não estava passando no Linter
const addLoader = () => {
  const itens = document.querySelector('.items');
  const div = document.createElement('div');
  div.classList.add('loading');
  itens.appendChild(div);
};

const removeLoader = () => {
  const loader = document.querySelector('.loading');
  loader.remove();
};

const fetchAPI = () => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const sectionItens = document.querySelector('.items');
  addLoader();
  const produtos = fetch(API_URL)
    .then((response) => response.json())
    .then((response) => response.results.forEach((produto) => {
      sectionItens.appendChild(createProductItemElement(produto));
  }))
  .then(() => removeLoader());
  return produtos;
};

const loadLocalStorage = () => {
  const itensSalvos = localStorage.getItem('cart');
  const carrinho = document.querySelector('.cart__items');
  carrinho.innerHTML = itensSalvos;
  carrinho.addEventListener('click', cartItemClickListener);
};

const addItemToCart = () => {
  const botoesAdd = document.querySelectorAll('.item__add');
  botoesAdd.forEach((botao) => botao.addEventListener('click', () => {
    const idProduto = botao.parentNode.firstChild.innerText;
    const carrinho = document.querySelector('.cart__items');
    return fetch(`https://api.mercadolibre.com/items/${idProduto}`)
    .then((response) => response.json())
    .then((produto) => carrinho.appendChild(createCartItemElement(produto)))
    .then(() => saveLocalStorage())
    .then(() => totalPrice());
  }));
};

const cleanCart = () => {
  const botaoLimpar = document.querySelector('.empty-cart');
  botaoLimpar.addEventListener('click', () => {
    const produtosCarrinho = document.querySelectorAll('.cart__item');
    if (produtosCarrinho.length > 0) {
    produtosCarrinho.forEach((produto) => produto.remove());
    localStorage.clear();
    totalPrice();
    }
  });
};

window.onload = function onload() {
  fetchAPI()
    .then(() => addItemToCart())
    .then(() => cleanCart());
  loadLocalStorage();
  totalPrice();
};