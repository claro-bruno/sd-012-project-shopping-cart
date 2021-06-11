const BASE_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

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
// A lista de produtos que devem ser exibidos é o _array_ `results` no `JSON` acima.

// Você **deve** utilizar a função `createProductItemElement(product)` para criar os componentes _HTML_ referentes a um produto.

// Adicione o elemento retornado da função `createProductItemElement(product)` como filho do elemento `<section class="items">`.

// **Obs:** as variáveis `sku`, no código fornecido, se referem aos campos `id` retornados pela API.

// Ativida 1
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const classitems = document.querySelector('.items');
  console.log(classitems);
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  classitems.appendChild(section);
  // return section;
}
// Ativida 1
async function fetchComputerAsync(search) {
  try {
  let results = await fetch(`${BASE_URL}${search}`);
  results = await results.json();
  results = await results.results;
  console.log(results);
  await results.forEach((computador) => createProductItemElement(computador));
} catch (error) {
    console.log('Deu errado o FETCH');
  }
}
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Ativida 3
function cartItemClickListener(event) {
  // coloque seu código aqui
}
// Ativida 3

// Ativida 2
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); // Ativida 3
  return li;
}
// Ativida 2

window.onload = function onload() { 
  fetchComputerAsync('computador');
};
