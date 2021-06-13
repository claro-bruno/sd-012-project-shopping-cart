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
function localStorageSaves() {
  const ol = document.querySelector('ol');

  localStorage.setItem('compras', JSON.stringify(ol.innerHTML));
  console.log(ol.innerHTML);
}

function cartItemClickListener(event) {
  const pai = document.querySelector('ol');
  console.log(pai);
  pai.removeChild(event.target);
  if (localStorage.getItem('compras')) {
    localStorage.setItem('compras', JSON.stringify(pai.innerHTML));
  }
}
function createCartItemElement(elemento) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = 'liId';
  li.innerText = `SKU: ${elemento.id} | NAME: ${elemento.title} | PRICE: $${elemento.price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement(elemento) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', elemento.id));
  section.appendChild(createCustomElement('span', 'item__title', elemento.title));
  section.appendChild(createProductImageElement(elemento.thumbnail));
  const btnCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');

  btnCart.addEventListener('click', () => {
    const ol = document.querySelector('ol');
    ol.appendChild(createCartItemElement(elemento));
    localStorageSaves();
  });
  section.appendChild(btnCart);

  return section;
}
function loading() {
  const section = document.querySelectorAll('.item');
  if (section.values === undefined) {
    const p = document.createElement('p');
    section.appendChild(p);
    p.className = 'loading';
    p.innerText('loading');
  }
}
async function returnFetch(search) {
  try {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`);
  const json = await response.json();
  const entries = Object.values(json.results);
  entries.forEach((elemento) => {
    const section = document.querySelector('.items');
    section.appendChild(createProductItemElement(elemento));
  });
} catch (error) {
  console.log('error');
}
}
function removeLI() {
  document.querySelectorAll('#liId').forEach((valor) => {
    valor.addEventListener('click', cartItemClickListener);
  });
}
function removeAllLi() {
const button = document.querySelector('.empty-cart');
button.addEventListener('click', () => {
const pai = document.querySelector('ol');
pai.innerHTML = '';
localStorage.removeItem('compras');
});
}
window.onload = function onload() {
  returnFetch('computador');

  const ol = document.querySelector('.cart__items');
  if (localStorage.getItem('compras')) {
    ol.innerHTML = JSON.parse(localStorage.getItem('compras'));
  }
  removeLI();
  removeAllLi();
  loading();
};
