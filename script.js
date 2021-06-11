const carItems = document.querySelector('.cart__items');

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

const totalPrice = [];

const totalCalc = () => {
  const total = totalPrice.reduce((acc, curr) => acc + curr, 0);
  document.querySelector('.total-price').innerText = `${total}`;
};

const clearCart = () => {
  const clearButton = document.querySelector('.empty-cart');
    clearButton.addEventListener('click', () => {
      carItems.innerHTML = '';
  });
};

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

const addLoading = () => {
  const createLoading = createCustomElement('p', 'loading', 'Loading...');
  document.querySelector('.cart').appendChild(createLoading);
};

const removeLoading = () => {
  document.querySelector('.loading').remove();
};

const addItemsInCart = () => {
  const arrayOfButtons = document.querySelectorAll('.item__add');
  arrayOfButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.parentNode.firstChild.innerText;

      try {
        addLoading();

        const fetchObject = await fetch(`https://api.mercadolibre.com/items/${id}`);
        const object = await fetchObject.json();
        totalPrice.push(object.price);
        carItems.appendChild(createCartItemElement(object));

        totalCalc();

        localStorage.setItem('carList', carItems.innerHTML);
      } catch (error) {
        console.log(error);
      }
      removeLoading();

    }); 
  });
};

const renderList = async (product) => {
  const items = document.querySelector('.items');
  const fetchObject = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`);
  const object = await fetchObject.json();
  const computers = await object.results;
  computers.forEach((item) => 
  items.appendChild(createProductItemElement(item)));
};

const addItems = async () => {
  try {
    addLoading();

    await renderList('computador');

    addItemsInCart();
  } catch (error) {
    console.log(error);
  }
  removeLoading();
};

window.onload = function onload() {
  addItems();
  carItems.innerHTML = localStorage.getItem('carList');
  clearCart();
};