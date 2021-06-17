const cartList = document.querySelector('.cart__items');
const itemsSection = document.querySelector('.items');
const total = document.querySelector('.total-price');
const PRODUCTS_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const ITEM_URL = 'https://api.mercadolibre.com/items/';

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

const increaseTotal = ({ price }) => {
  total.innerText = (Math.round((parseFloat(total.innerText) + price) * 100) / 100);
};

const decreaseTotal = (price) => {
  total.innerText = (Math.round((parseFloat(total.innerText) - parseFloat(price)) * 100) / 100);
};

const updateStorage = () => {
  localStorage.setItem('cartList', cartList.innerHTML);
  localStorage.setItem('total', total.innerText);
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  const price = event.target.innerText.split('$')[1];
  decreaseTotal(price);
  updateStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const appendProducts = (results) => {
  results.forEach((product) => {
    itemsSection.appendChild(createProductItemElement(product));
  });
};

const appendCartItem = (info) => {
  const cartItem = createCartItemElement(info);
  cartList.appendChild(cartItem);
};

const removeLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

const buttonEvents = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
        const loadingItem = createCustomElement('li', 'loading', 'Carregando Item');
        cartList.appendChild(loadingItem);
        const section = event.target.parentElement;
        const itemSku = getSkuFromProductItem(section);
        const promise = await fetch(`${ITEM_URL}${itemSku}`);
        const info = await promise.json();
        removeLoading();
        appendCartItem(info);
        increaseTotal(info);
        updateStorage();
      });
  });
};

const fetchProduct = async (item) => {
  try {
    const loadingProducts = createCustomElement('p', 'loading', 'Carregando Lista de Produtos');
    itemsSection.appendChild(loadingProducts);
    const promise = await fetch(`${PRODUCTS_URL}${item}`);
    const { results } = await promise.json();
    removeLoading();
    appendProducts(results);
    buttonEvents();
  } catch (error) {
    alert('Erro ao requerir os dados. Tente novamente mais tarde');
  }
};

document.querySelector('.empty-cart').addEventListener('click', () => {
  cartList.innerHTML = '';
  document.querySelector('.total-price').innerHTML = 0;
  updateStorage();
});

const updateTotal = () => {
  const check = localStorage.getItem('total');
  if (check === null) {
    total.innerText = 0;
  } else {
    total.innerText = check;
  }
};

const updateCart = () => {
  cartList.innerHTML = localStorage.getItem('cartList');
};

const reassingEvents = () => {
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

window.onload = function onload() {
  fetchProduct('computador');
  updateTotal();
  updateCart();
  reassingEvents();
};
