// const print = (param) => console.log(param);
const updateTotal = (arrayValores) => {
  const total = arrayValores.reduce((acc, preco) => acc + preco, 0);
  const getTotal = document.getElementsByClassName('total-price');
  getTotal[0].innerText = total;
};

const totalPrice = () => {
  const cartList = document.querySelectorAll('.cart__item');
  const array = [];
  cartList.forEach((item) => {
    const conteudo = item.innerText.split(' ');
    let preco = conteudo[conteudo.length - 1];
    preco = Number(preco.replace(/\$/g, ''));
    array.push(preco);
  });
  updateTotal(array);
};

const addLoading = (local) => {
  const getLocal = document.querySelector(local);
  const h1 = document.createElement('h1');
  h1.className = 'loading';
  h1.innerText = 'Loading...';
  h1.style = 'text-align: center;';
  getLocal.appendChild(h1);
};

const remLoading = (local) => {
  const getLocal = document.querySelector(local);
  const getLoading = document.querySelector('.loading');
  getLocal.removeChild(getLoading);
};

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
  const carrinho = document.querySelector('ol');
  localStorage.setItem('cartList', carrinho.innerHTML);
  totalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

 const fetchItem = async () => {
   try {
    addLoading('.items');
    const QUERY = 'computador';
    const sectionItem = document.querySelector('.items');
    const resp = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
    const obj = await resp.json();  
      obj.results.forEach((item) => 
      sectionItem.appendChild(createProductItemElement(item)));
   } catch (error) {
      alert('Error, Try again later!');
   }
   remLoading('.items');
};

const fetchCart = async (id) => {
  try {
    const itemID = id;
    const local = '.cart__items';
    const cartItem = document.querySelector(local);
    const resp = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
    const item = await resp.json();
      cartItem.appendChild(createCartItemElement(item));
      localStorage.setItem('cartList', cartItem.innerHTML);
      remLoading(local);
      totalPrice();
  } catch (error) {
    alert('Error, Try again later!');
  }
};

const addCart = () => {
  const getButton = document.querySelectorAll('.item');
  getButton.forEach((element) => element.addEventListener('click', () => {
    addLoading('.cart__items');
    const id = getSkuFromProductItem(element);
    fetchCart(id);
  }));
};

const getFromStorage = () => {
  const carrinho = document.querySelector('ol');
  carrinho.innerHTML = localStorage.getItem('cartList');
  const item = carrinho.querySelectorAll('li');
  item.forEach((e) => {
    e.addEventListener('click', cartItemClickListener);
  });
};

const clearCartListener = () => {
  const carrinho = document.querySelector('ol');
  carrinho.innerHTML = '';
  localStorage.setItem('cartList', '');
  totalPrice();
};

const clearCart = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', clearCartListener);
};

window.onload = function onload() { 
  fetchItem().then(() => {
    addCart();
  });

  getFromStorage();
  clearCart();
  totalPrice();
};