function salvarLocal() {
  const ol = document.querySelector('ol.cart__items');
  localStorage.setItem('cart', ol.innerHTML);
  const price = document.querySelector('span.total-price');
  localStorage.setItem('cartPrice', price.innerHTML);
}

function loadLocal() {
  const priceLoad = document.querySelector('span.total-price');
  const value = localStorage.getItem('cartPrice');
  if (value !== null) {
    priceLoad.innerHTML = value;
  }

  const ol = document.querySelector('ol.cart__items');
  const element = localStorage.getItem('cart');
  ol.innerHTML = element;
}

function sumPrice(price) {
  const atual = document.querySelector('.total-price');
  atual.innerText = Math.round((parseFloat(atual.innerText) + price) * 100) / 100;
}

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const valueSplit = event.target.innerHTML.split('$');
  const value = parseFloat(valueSplit[valueSplit.length - 1]);
  const atual = document.querySelector('.total-price');
  atual.innerHTML = Math.round((parseFloat(atual.innerHTML) - value) * 100) / 100;
  event.target.remove();
  salvarLocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchApi = async () => {
  const element = document.querySelector('.items');

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((array) => {
    const lista = array.results;
    lista.forEach((item) => {
      const objeto = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      element.appendChild(createProductItemElement(objeto));
    });
  }); 
};

const handleButton = (id) => {
  const cart = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then(({ id: sku, title: name, price: salePrice }) => {
    cart.appendChild(createCartItemElement({ sku, name, salePrice }));
    sumPrice(salePrice);
    salvarLocal();
  });
};

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('item__add')) {
    const id = event.target.parentNode.firstChild.innerText;
    handleButton(id);
  }
});

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('cart__item')) {
    // const valueSplit = event.target.innerHTML.split('$');
    // const value = parseFloat(valueSplit[valueSplit.length -1]);
    // const atual = document.querySelector('.total-price');
    // atual.innerHTML = Math.round((parseFloat(atual.innerHTML) - value) * 100) / 100;
    cartItemClickListener(event);
    // event.target.remove();
    // salvarLocal();
  }
});

window.onload = function onload() {
  fetchApi();
  loadLocal();
};
