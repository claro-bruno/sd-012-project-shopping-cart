const linkML = 'https://api.mercadolibre.com/sites/MLB/search?q=';

const addAoCarrinho = 'https://api.mercadolibre.com/items/';

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

function createProductItemElement({ sku, name, image }) {
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
  console.log(event);
event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function buscaItensId(btnId) {
  fetch(`${addAoCarrinho}${btnId}`)
  .then((response) => (response.json()))
  .then(({ id: sku, title: name, price: salePrice }) => {
   const li = createCartItemElement({ sku, name, salePrice });
  const buscaOl = document.querySelector('.cart__items');
  buscaOl.appendChild(li);
  // esvaziarCarrinho();
});
}

function capButton() {
  const allButtons = document.querySelectorAll('.item__add');
  allButtons.forEach((btn) => btn.addEventListener('click', (event) => { 
     const btnId = event.target.parentNode.firstChild.innerText;
     buscaItensId(btnId);
  }));
}

async function buscaItensAPI() {
  await fetch(`${linkML}computador`)
  .then((response) => (response.json()))
  .then((Object) => Object.results.forEach((result) => { 
    const intensAPI = createProductItemElement(
      { sku: result.id, name: result.title, image: result.thumbnail },
); 
    document.querySelector('.items').appendChild(intensAPI);
}));
capButton();
}

function esvaziarCarrinho() {
  const limpaCarrinho = document.querySelector('.empty-cart');
  // const todosItensCarrinho = document.getElementsByClassName('cart__item');
  // console.log(todosItensCarrinho);
  limpaCarrinho.addEventListener('click', (event) => {
    const capOL = document.querySelector('.cart__items');
    capOL.innerHTML = '';   
    console.log(capOL.innerHTML);
//   [...todosItensCarrinho].forEach((li) => {
// li.remove();
  // });
});
}

window.onload = async function onload() { 
  await buscaItensAPI();
  esvaziarCarrinho();
};