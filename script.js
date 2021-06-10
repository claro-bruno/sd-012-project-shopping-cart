const cartList = document.querySelector('.cart__items');
const itemsSection = document.querySelector('.items');
const total = document.querySelector('.total-price');

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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  const price = event.target.innerText.split('$')[1];
  decreaseTotal(price);
  localStorage.setItem('cartList', cartList.innerHTML);
  localStorage.setItem('total', total.innerText);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const appendComputers = (results) => {
  results.forEach((computer) => {
    itemsSection.appendChild(createProductItemElement(computer));
  });
};

const appendCartItem = (info) => {
  const cartItem = createCartItemElement(info);
  cartList.appendChild(cartItem);
};

const buttonEvents = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', async (event) => {
        const section = event.target.parentElement;
        const itemSku = getSkuFromProductItem(section);
        const promise = await fetch(`https://api.mercadolibre.com/items/${itemSku}`);
        const info = await promise.json();
        appendCartItem(info);
        increaseTotal(info);
        localStorage.setItem('cartList', cartList.innerHTML);
        localStorage.setItem('total', total.innerText);
      });
  });
  // const listItems = document.querySelectorAll('.cart__items');
  // listItems.forEach((listItem) => {
  //   listItem.addEventListener('click', cartItemClickListener);
  // });
};

const removeLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

const fetchComputers = async () => {
  try {
    const promise = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const { results } = await promise.json();
    appendComputers(results);
    buttonEvents();
    removeLoading();
  } catch (error) {
    alert('Erro ao requerir os dados. Tente novamente mais tarde');
  }
};

document.querySelector('.empty-cart').addEventListener('click', () => {
  cartList.innerHTML = '';
  document.querySelector('.total-price').innerHTML = 0;
  localStorage.setItem('cartList', cartList.innerHTML);
  localStorage.setItem('total', total.innerText);
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

window.onload = function onload() {
  fetchComputers();
  updateTotal();
  updateCart();
};
