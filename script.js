// Cria as img's que abrigaram as imagens de cada um dos elementos html
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

// Captura o id de cada um dos itens e os submete ao método innerText
function getSkuFromProductItem(item) {
  return item.querySelector('span0.item__sku').innerText;
}

// Especifica as ações após o evento da addEventListener da createCartItemElement
function cartItemClickListener(event) {
  // coloque seu código aqui 
  const itemClicado = event.target.id;
  return itemClicado; // test para o req 2
}

// Cria o elemento da lista do carrinho de compras referente a cada section e submete tais elementos a um evento
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  /* console.log(sku);  */
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener());
  return li;
}

// Fazer um appendChild do item retorando pela createCartItemElement
const criarItensDoCarrinho = () => { 
  const idProduto = Event.target;
  console.log(idProduto); // Não foi consolado. 13.06
  return fetch(`https://api.mercadolibre.com/items/${idProduto}`)
    .then((item) => console.log(item.json))
      .then((item) => document.querySelector('.cart__items')
        .appendChild(createCartItemElement(item)));
};

const eventoDeClique = () => {
  const botoes = document.getElementsByClassName('item__add');
  const arrayDeBotoes = [...botoes];
  /* console.log(document.querySelector('.cart__items')); */
  arrayDeBotoes.forEach((botao) => {
    console.log(botao);
    botao.addEventListener('click', criarItensDoCarrinho());
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

window.onload = function onload() { 
  // Requisito 1
  criarListaDeProdutos(); 
  /* eventoDeClique(); */
};
