const apiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

// colocando "id: sku" estamos fazendo destruction do parâmetro
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

// 3 requisito abaixo----------------------------------------------------------

function cartItemClickListener(event) {
  event.target.remove();
}

// -----------------------------------------------------------------------------

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const listCart = document.querySelector('.cart__items');
const saveCart = () => {  
  localStorage.setItem('myCart', listCart.innerHTML);
  console.log(listCart.childElementCount);
}

function loadCart() {
  listCart.innerHTML = localStorage.getItem('myCart');
  const teste = document.querySelectorAll('.cart__item');
  teste.forEach((li) => li.addEventListener('click' ,cartItemClickListener));
}

// 2 requisito abaixo ----------------------------------------------------------

const addItens = async (id) => {
  let idItem = await fetch(`https://api.mercadolibre.com/items/${id}`);
  idItem = await idItem.json();
  // console.log(idItem);
  const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement(idItem));
  saveCart(id);  
};

const addCart = () => {
  const btnAdd = document.querySelectorAll('.item__add');
btnAdd.forEach((button) => {
  button.addEventListener('click', (event) => {
    const getId = event.target.parentElement.firstChild.innerText; // para pegar o id
    console.log(getId);
    addItens(getId);
    // saveCart(getId);
  });
});
};

// 4 requisito tentativa frustada --------------------------------------------

// const saveCart = () => {
//   const ol = document.querySelector('.cart__items');
//   localStorage.setItem('myCart', ol.innerHTML);
//   console.log(ol.childElementCount);
// }

// 1 requisito abaixo ----------------------------------------------------------

const fetchML = () => {
  const itens = document.querySelector('.items');
  fetch(apiMercadoLivre)
  .then((response) => response.json())
  .then((response) => response.results)
  .then((arr) => arr.forEach((item) => itens.appendChild(createProductItemElement(item))))
  .then(() => addCart());
};

window.onload = function onload() {
  fetchML();
  loadCart();
  
 };
