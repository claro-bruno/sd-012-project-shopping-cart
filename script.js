window.onload = function onload() { 
  fetchURL(URL_MLB);
};

// codigo criado com a ajuda do aluno Thalles
const URL_MLB = "https://api.mercadolibre.com/sites/MLB/search?q=computador";

async function fetchURL(URL_MLB) {
  const response = await fetch(URL_MLB);
  const data = await response.json();
  const arrayResults = data["results"];
  arrayResults.forEach((product) => document.querySelector('.items').appendChild(createProductItemElement(product)));
}


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

// feito com a ajuda do aluno Thalles (renomear os parametro da desestruturacao)
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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

  