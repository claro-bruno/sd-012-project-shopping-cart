// Cria as img's que abrigaram as imagens de cada um dos elementos html
const arrayDeValores = [];
let precoFinal = 0;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Cria as customizações de cada um dos elementos durante a criação deles em createProductItemElement().
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
/* function getSkuFromProductItem(item) {
  return item.querySelector('span0.item__sku').innerText;
} */

const sumPrice = (price) => {
  arrayDeValores.push(price.salePrice);
  precoFinal = arrayDeValores.reduce((acc, current) => {
    let acumulador = acc;
    acumulador += current;
    return acumulador;
      }, 0);
      document.querySelector('.total-price').innerHTML = `Preço Total: $${precoFinal}`;
};

function cartItemClickListener(event) {
  // coloque seu código aqui 
  const itemClicado = event.target;
  itemClicado.parentNode.removeChild(itemClicado);
  const itemRetirado = itemClicado.innerText.split('PRICE: $')[1];
  precoFinal -= itemRetirado;
  document.querySelector('.total-price').innerHTML = `Preço Total: $${precoFinal}`;
}

// Cria o elemento da lista do carrinho de compras referente a cada section e submete tais elementos a um evento
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  /* console.log(sku);  */
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  sumPrice({ salePrice });
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Fazer um appendChild do item retorando pela createCartItemElement
const criarItensDoCarrinho = (event) => { 
  const idProduto = event.target.parentNode.firstChild.innerHTML;
  /* console.log(idProduto);   */
  fetch(`https://api.mercadolibre.com/items/${idProduto}`)
    .then((item) => item.json())
      .then((item) => document.querySelector('.cart__items')
        .appendChild(createCartItemElement(item)));
};

const eventoDeClique = () => {
  const botoes = document.querySelectorAll('.item');
  /* console.log(botoes); */
  botoes.forEach((botao) => {
    /* console.log(botao); */
    botao.lastChild.addEventListener('click', criarItensDoCarrinho);
  });
};

// Cria um elemento HTML, com característica especificas, para cada um dos itens retornados pela API em criaElementos().
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
    
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Requisito 1
// Acessa todos os itens a partir do retorno do objeto da API

const criarListaDeProdutos = () => {
  const produtoAlvo = 'computador';
 fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produtoAlvo}`)
   .then((response) => response.json())
     .then((response) => response.results
       .forEach((elemento) => {
          /* console.log(elemento); */
          const elementoPai = document.querySelector('.items');
          elementoPai.appendChild(createProductItemElement(elemento));
          })).then(() => eventoDeClique());
};

// Req 6
const clearCart = () => {
  document.querySelector('.cart__items').innerHTML = '';
};

// Req 6
const esvaziarCarrinho = () => {
  document.querySelector('.empty-cart')
    .addEventListener('click', clearCart);
};

window.onload = function onload() { 
  // Requisito 1
  criarListaDeProdutos(); 
  esvaziarCarrinho();
  /* eventoDeClique(); */
};
