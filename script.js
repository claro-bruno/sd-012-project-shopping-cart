// requisito 1 feito com suporte do colega Julio Barros
const intensExibidos = document.querySelector('.items');

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

// requisito 2 feito com suporte do colega Julio Barros
function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function cartItemClickListener(event) {
  const text = event.target.innerText;
  const valor = parseFloat(text.split('$')[1]);
  const total = document.querySelector('.total-price').innerText;
  const totalF = total - valor;
  document.querySelector('.total-price').innerText = totalF;
  event.target.remove();
  saveCartItemToLocalStorage();
}// coloque seu código aqui

async function adicionaCarrinho(event) {
  const elementoPai = event.target.parentNode;
  const nomeProduto = elementoPai.firstChild.innerText;
  const linkApi = 'https://api.mercadolibre.com/items/';
  const listaDeCompras =  document.querySelector('.cart__items')
  try{
    const retorno = await fetch(`${linkApi}${nomeProduto}`);
    const result = await retorno.json();
    console.log(nomeProduto)
    listaDeCompras.appendChild(createCartItemElement(result))
      .addEventListener('click', cartItemClickListener);
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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')) .addEventListener('click', adicionaCarrinho);

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
    console.log(results)
    mostrarProdutos(results);
     } catch (error) {
    return error;
  }
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// requisito 3

window.onload = function onload() {
  listadeProdutos();
};
