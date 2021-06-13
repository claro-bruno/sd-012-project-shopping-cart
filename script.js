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

// Captura o id de cada um dos itens e os submete ao método innerText
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 2

// Especifica as ações após o evento da addEventListener da createCartItemElement
function cartItemClickListener(event) {
  // coloque seu código aqui 
  const itemClicado = event.target.id;
}

// Cria o elemento da lista do carrinho de compras referente a cada section e submete tais elementos a um evento
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener());
  return li;
}
/* createCartItemElement(); */
/* const criarItensDaList = () => {
  const array = [...document.querySelectorAll('.item__add')];
  console.log(array);
  array.forEach((item) => {
    console.log(item);
    let sku = item.
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then((response) => response.json)
        .then((response) => response);
  }); 
}; */

// Requisito 1
// Acessa todos os itens a partir do retorno do objeto da API

const criarItensDaList = () => {
  const array = [...document.querySelectorAll('.item__add')];
  /* console.log(array); */
  array.forEach((item) => {
    //let sku = item.id
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then((response) => response.json)
        .then((response) => response);
  }); 
};

const criaElementos = () => {
  const produtoAlvo = 'computador';
 fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produtoAlvo}`)
 .then((response) => response.json())
 .then((response) => response.results.forEach((elemento) => {
   /* console.log(elemento); */
   const elementoPai = document.querySelector('.items');
   elementoPai.appendChild(createProductItemElement(elemento));
 })).then(() => criarItensDaList()); 
};

window.onload = function onload() { 
  // Requisito 1
  criaElementos(); 
  /* criarItensDaList(); */
};
