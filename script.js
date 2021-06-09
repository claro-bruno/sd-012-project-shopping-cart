const cartItemsClass = '.cart__items';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

// REQUISITO 5
function payment() {
const payout = document.querySelector('.total-price');
const list = [...document.querySelectorAll('.cart__item')];

  const sum = list.reduce((acc, value) => acc + Number(value.innerText.split('PRICE: $')[1]), 0);
  payout.innerText = sum;
}

// REQUISITO 1
// function productList() {
//   fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
//   .then((response) => response.json())
//   .then((response) => response.results)
// }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(event) {
  const buttonAddItems = document.querySelectorAll('.item__add');
  buttonAddItems.forEach((element) => element.addEventListener('click', () => {
    const itemId = element.parentElement.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json())
    .then((data) => {
      const ol = document.querySelector('ol');
      const count = ol.childElementCount;
      localStorage.setItem('TotalItems', `${count}`);
      localStorage.setItem(`Item${count}`,
      `SKU: ${data.id} | NAME: ${data.title} | PRICE: $${data.price}`);
      document.querySelector(cartItemsClass).appendChild(createCartItemElement(data));
    }).then(() => payment());
  }));
}

async function productList() {
  const itemSection = document.querySelector('section .items');
  
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const { results } = await response.json();
  results.forEach((product) => {
    const component = createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    });
    component.querySelector('button').addEventListener('click', addToCart);
    itemSection.appendChild(component);
  });
}

window.onload = async function onload() {
  await productList();
};
