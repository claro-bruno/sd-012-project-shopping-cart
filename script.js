const urlProducts = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
// const cart = JSON.parse(localStorage.getItem('cartProducts')) || [];

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
function getButton(botao) {
  return botao.querySelector('button.item__add');
}

// function removeFromLocalStorage(event) {
//   const index = cart.indexOf(event.innerText);
//   if (index !== -1) {
//     cart.splice(index, 2);
//   }
// }

const saveCart = () => {  
  // cart.push(product.innerText);
  // localStorage.setItem('cart', JSON.stringify(cart));
  const ol = document.querySelector('ol.cart__items');
  localStorage.setItem('cart', ol.innerHTML);
};
const checkIfSave = () => {
  const saved = localStorage.getItem('cart');
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = saved;
};

function cartItemClickListener(event) {
  if (event.className === 'cart__item') {
    event.remove();
    saveCart();
   }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const catchId = () => {
  // const buttons = document.querySelectorAll('.item__add');
  const allItem = document.querySelectorAll('.item');
  const ol = document.querySelector('.cart__items');
  allItem.forEach((item) => {
    const result = getSkuFromProductItem(item);
    const button = getButton(item);
    button.addEventListener('click', () => {
      fetch(`https://api.mercadolibre.com/items/${result}`)
      .then((response) => response.json())
      .then((data) => createCartItemElement(data))
      .then((li) => ol.appendChild(li))
      .then(() => saveCart());
    });
});
};

const fetchURL = (url) => {
  const idItem = document.querySelector('.items');
  fetch(url)
  .then((response) => response.json())
  .then((indice) => indice.results)
  .then((items) => items.forEach((item) => idItem.appendChild(createProductItemElement(item))))
  .then(() => catchId());
};

document.addEventListener('click', (event) => {
  cartItemClickListener(event.target);
});
window.onload = function onload() {
  fetchURL(urlProducts);
  checkIfSave();
};

//  Adicoes e remocoes do local storage tem de ser computadas no local
//  quando um elemento é adicionado ao carrinho, ele deve ser adicionado ao local
// quando um elemento é retirado, ele deve ser excluido do local
