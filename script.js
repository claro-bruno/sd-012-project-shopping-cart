const BASE_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

// async function takeIdItem(event) { 
//   event.target.classList.add('selected');
//    try {
//     let results = ;
//     results = await results.json();
//     results = await results.results;
//     let testandoId = await results.find((computador) => computador.id === ItemID);
//     // console.log(testandoId);
//   } catch (error) {
//       console.log('Deu errado o FETCH 2');
//     }
// }

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.addEventListener('click', cartItemClickListener);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener); // Ativida 3
  ol.appendChild(li);
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

// Ativida 1
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const classitems = document.querySelector('.items');
  // console.log(classitems);
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const itemAdd = section.querySelector('.item__add');
  classitems.appendChild(section);
  itemAdd.addEventListener('click', createCartItemElement);
}
// Ativida 1

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Ativida 3

// Ativida 3

// Ativida 2

// Ativida 2

async function fetchComputerAsync(search) {
  try {
  let results = await fetch(`${BASE_URL}${search}`);
  results = await results.json();
  results = await results.results;
  // console.log(results);
  await results.forEach((computador) => createProductItemElement(computador));
} catch (error) {
    console.log('Deu errado o FETCH');
  }
}
function emptyList() {
  const emptyBttn = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  emptyBttn.addEventListener('click', () => {
  ol.replaceChildren('');
  });
}

window.onload = function onload() { 
  fetchComputerAsync('computador');
  emptyList();
};
