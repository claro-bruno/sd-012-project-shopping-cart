const urlProducts = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

// Funcoes auxiliares do requisito 1
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
// Fim das funcoes auxiliares do requisito 1

// Funcao Auxiliar, requisito 2.
function getSkuFromProductItem(item) {
   return item.querySelector('span.item__sku').innerText;  
}
// Funcao Auxiliar, requisito 2.
function getButton(botao) {
  return botao.querySelector('button.item__add');
}

// Funcao requisito 6
const removeButton = () => {
  const li = document.querySelectorAll('li.cart__item');
  const value = document.querySelector('p.total-price');
  li.forEach((removed) => removed.remove());
  value.innerText = 0;
  localStorage.removeItem('cart');
  localStorage.removeItem('price');
};

// Funcao auxiliar do requisito 5
const getPrice = (price) => {
  const totalPrice = document.querySelector('.total-price');
  const convert = parseFloat(totalPrice.innerText);
  totalPrice.innerText = convert + price;
};

// Funcao auxiliar do requisito 4
const saveCart = () => {  
  // cart.push(product.innerText);
  // localStorage.setItem('cart', JSON.stringify(cart));
  const ol = document.querySelector('ol.cart__items');
  const total = document.querySelector('.total-price');
  localStorage.setItem('cart', ol.innerHTML);
  localStorage.setItem('price', total.innerText);
};

// Funcao auxiliar do requisito 5
const removePrice = (event) => {
  const price = event.innerText.split('$')[1];
  const totalPrice = document.querySelector('p.total-price');
  const convert = parseFloat(totalPrice.innerText);
  totalPrice.innerText = convert - price;
};

// Funcao auxiliar do requisito 4
const checkIfSave = () => {
  const saved = localStorage.getItem('cart');
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = saved;
  const savedPrice = parseFloat(localStorage.getItem('price'));
  if (savedPrice) {
    getPrice(savedPrice);
  }
};

// Cumpre requisito 3.
function cartItemClickListener(event) {
  if (event.className === 'cart__item') {
    removePrice(event);
    event.remove();
    saveCart();
   }
}

// Funcao auxiliar do requisito 2
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// Cumpre requisito 2, está sendo chamada dentro do window.onload
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
      .then((data) => {
        const li = createCartItemElement(data);
        getPrice(data.price);
        ol.appendChild(li);
      })
      .then(() => saveCart());
    });
});
};
// Cumpre requisito 1, está sendo chamada dentro do window.onload
const fetchURL = (url) => {
  const idItem = document.querySelector('.items');
  const loading = document.querySelector('.loading');
  fetch(url)
  .then((response) => response.json())
  .then((indice) => indice.results)
  .then((items) => items.forEach((item) => idItem.appendChild(createProductItemElement(item))))
  .then(() => catchId())
  .then(() => loading.remove());
};
// Cumpre requisito 3.
document.addEventListener('click', (event) => {
  cartItemClickListener(event.target);
});
window.onload = function onload() {
// Cumpre requisito 1
  fetchURL(urlProducts);
// Cumpre requisito 4
  checkIfSave();
// Requisito 6
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', removeButton);
};