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

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemsInCart = () => {
  const carItems = document.querySelector('.cart__items');
  const arrayOfButtons = document.querySelectorAll('.item__add');
  arrayOfButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.parentNode.firstChild.innerText;
      try {
        await fetch(`https://api.mercadolibre.com/items/${id}`)
        .then((response) => response.json())
        .then((item) => carItems.appendChild(createCartItemElement(item)));
        localStorage.setItem('carList', document.querySelector('.cart__items').innerHTML);
      } catch (error) {
        console.log(error);
      }
    }); 
  });
};

const addItems = async () => {
  const items = document.querySelector('.items');
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((computer) => computer.results)
  .then((products) => products.forEach((item) => 
    items.appendChild(createProductItemElement(item))));
  addItemsInCart();
};

window.onload = function onload() {
  addItems();
  const carList = document.querySelector('.cart__items');
  carList.innerHTML = localStorage.getItem('carList');
};