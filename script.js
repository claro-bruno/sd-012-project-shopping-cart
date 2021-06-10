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

async function cartItemClickListener(event) {
  const erasePrice = event.target.innerText.split('$')[1] * -1;
  totalPrice.push(erasePrice);
  await event.target.remove();
  await totalCalc();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const totalPrice = [];

const totalCalc = () => {
  const total = totalPrice.reduce((acc, curr) => acc + curr, 0);
  document.querySelector('.total-price').innerText = `${total}`
}

const addItemsInCart = () => {
  const carItems = document.querySelector('.cart__items');
  const arrayOfButtons = document.querySelectorAll('.item__add');
  const createSpan = document.createElement('p');
  createSpan.innerHTML = 'O preço total é: '
  arrayOfButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.parentNode.firstChild.innerText;
      try {
        await fetch(`https://api.mercadolibre.com/items/${id}`)
        .then((response) => response.json())
        .then((item) => {
          totalPrice.push(item.price)
          carItems.appendChild(createCartItemElement(item))
        });
        totalCalc()
        localStorage.setItem('carList', carItems.innerHTML);
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