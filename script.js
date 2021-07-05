// requisito 1 feito com suporte do colega Julio Barros
const intensExibidos = document.querySelector('.items');
const listaDeCompras = document.querySelector('.cart__items');

//  requisito 4
function salvaStorage() {
  localStorage.setItem('salvaCarrinho', listaDeCompras.innerHTML);
}

// requisito 1
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// requisito 3
function cartItemClickListener(event) {
  event.target.remove();
  salvaStorage();
}
// requisito 4
function recuperaLista() {
  listaDeCompras.innerHTML = localStorage.getItem('salvaCarrinho');
  const itensDoCarrinho = document.querySelectorAll('.cart__items');
  itensDoCarrinho.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

// requisito 2 feito com suporte do colega Julio Barros
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//  requisito 2
async function adicionaCarrinho(event) {
  const elementoPai = event.target.parentNode;
  const nomeProduto = elementoPai.firstChild.innerText;
  const linkApi = 'https://api.mercadolibre.com/items/';
    try {
    const retorno = await fetch(`${linkApi}${nomeProduto}`);
    const result = await retorno.json();
    listaDeCompras.appendChild(createCartItemElement(result))
      .addEventListener('click', cartItemClickListener);
      salvaStorage();
  } catch (error) {
    return error;
  }
}

// requisito 1
function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', adicionaCarrinho);

  return section;
}
// console.log('cheguei aqui 1')
const mostrarProdutos = (arrayResult) => {
    arrayResult.forEach((item) => {
    intensExibidos.appendChild(createProductItemElement(item));
  });
 };

async function listadeProdutos() {
    try {
    const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const { results } = await api.json();
    mostrarProdutos(results);
    } catch (error) {
    return error;
  }
}


// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = function onload() {
  listadeProdutos();
  recuperaLista();
};
