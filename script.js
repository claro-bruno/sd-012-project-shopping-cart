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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const lista = document.querySelector('ol');
  lista.removeChild(event.target);
  localStorage.setItem('shopCart', lista.innerHTML);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addingTotalToStorage(product) {
  const totalPrice = document.querySelector('.total-price');
  if (!product) {
    totalPrice.innerText = localStorage.getItem('shopPrice');
    return;
  }
  let somaProdutos;
  if (!localStorage.getItem('shopPrice')) somaProdutos = 0;
  else somaProdutos = Number(localStorage.getItem('shopPrice'));
  somaProdutos += Number(product.price);
  localStorage.setItem('shopPrice', somaProdutos);
  totalPrice.innerText = localStorage.getItem('shopPrice');
}



function itemClickListener() {
  const loading = document.querySelector('.loading');
  const items = document.querySelectorAll('.item');
  items.forEach((item) => {
    const button = item.querySelector('button');
    const id = getSkuFromProductItem(item);
    button.addEventListener('click', async () => {
     await fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => {
        loading.style.display = 'inline';
        return response.json();
      }).then((product) => {
        const lista = document.querySelector('.cart__items');
        const produto = createCartItemElement(product);
        lista.appendChild(produto);
        localStorage.setItem('shopCart', lista.innerHTML);
        addingTotalToStorage(product);
      });
      loading.style.display = 'none';
    });
  });
}

async function fetchingProducts() {
  const loading = document.querySelector('.loading');
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => {
     loading.style.display = 'inline';
   return response.json();
  }).then((data) => data.results)
  .then((results) => {
    results.forEach((product) => {
      const items = document.querySelector('.items');
      const newItem = createProductItemElement(product);
      items.appendChild(newItem);
    });
    loading.style.display = 'none';
  });

  itemClickListener();
}

function clearingCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const listaCarrinho = document.querySelector('ol');
    listaCarrinho.innerHTML = '';
    localStorage.setItem('shopCart', listaCarrinho.innerHTML);
    localStorage.setItem('shopPrice', 0);
    const totalPrice = document.querySelector('.total-price');
    totalPrice.innerText = localStorage.getItem('shopPrice');
  });
}

window.onload = function onload() { 
  const listaCarrinho = document.querySelector('ol');
  listaCarrinho.innerHTML = localStorage.getItem('shopCart');
  const li = listaCarrinho.querySelectorAll('li');
  li.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
  fetchingProducts();
  addingTotalToStorage();
  clearingCart();
};