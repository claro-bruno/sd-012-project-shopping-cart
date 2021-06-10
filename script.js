const totalPrice = () => {
  const cart = document.getElementsByClassName('cart')[0];
  const priceElement = document.createElement('section');
  const textElement = document.createElement('label'); 
  priceElement.className = 'total-price';
  textElement.className = 'price-label';
  cart.appendChild(textElement);
  cart.appendChild(priceElement);
  priceElement.innerText = '0';
  textElement.innerText = 'Total Price:';
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const updateStorage = () => {
  const cartItems = document.querySelectorAll('.cart__items')[0];
  const totalPriceElement = document.getElementsByClassName('total-price')[0];
  if (localStorage.carrinho) {
    localStorage.carrinho = cartItems.innerHTML;
  } else {
    localStorage.setItem('carrinho', cartItems.innerHTML);
  }
  if (localStorage.totalPrice) {
    localStorage.totalPrice = totalPriceElement.innerHTML;
  } else {
    localStorage.setItem('totalPrice', 0);
  }
};

function cartItemClickListener(event) {
  const innerText = event.target.innerText;
  const price = parseFloat(innerText.split('$').pop());
  const totalPriceElement = document.getElementsByClassName('total-price')[0];
  let curr = parseFloat(totalPriceElement.innerText);
  curr -= price;
  totalPriceElement.innerText = curr.toFixed(2);
  event.target.remove();
  updateStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const sumPrice = ({ price: salePrice }) => {
  const totalPriceElement = document.getElementsByClassName('total-price')[0];
  let curr = parseFloat(totalPriceElement.innerText);
  curr += salePrice;
  totalPriceElement.innerText = curr.toFixed(2); 
};

const fetchItems = async (id) => {
  const itemObj = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const itemJson = await itemObj.json();
  const item = createCartItemElement(itemJson);
  sumPrice(itemJson);
  document.getElementsByClassName('cart__items')[0].appendChild(item);
  updateStorage();
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', (event) => {
      const id = event.target
        .parentElement
        .firstChild
        .innerText;
      fetchItems(id);  
    });
  }
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

const fetchApi = async () => {
  const promiseFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((r) => r.json());
  promiseFetch.results.forEach((element) => {
    const item = createProductItemElement(element);
    document.getElementsByClassName('items')[0].appendChild(item); 
  });
};

const cartLoad = () => {
  const cart = document.querySelectorAll('.cart__items')[0];
  cart.innerHTML = localStorage.carrinho;
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
  const totalPriceElement = document.getElementsByClassName('total-price')[0];
  totalPriceElement.innerHTML = parseFloat(localStorage.totalPrice);
};

window.onload = function onload() {
  totalPrice();
  fetchApi();
  cartLoad();
};