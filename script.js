const cartItem = '.cart__items';

const loadingDiv = () => {
  if (document.querySelector('.loading') === null) {
    const div = document.createElement('div');
    div.className = 'loading';
    div.innerText = 'LOADING...';
    console.log(div);
    document.querySelector('.items').appendChild(div);
    console.log(document.querySelector('.loading'));
    console.log(true);    
  } else {
    document.querySelector('.loading').remove();
    console.log(false);       
  }
};

const appendPrice = (price) => {
  const totalPricePlace = document.querySelector('.total-price');
  let value = Math.round((Number(totalPricePlace.innerText) + Number(price)) * 100) / 100;
  value = value === 0 ? '' : value;
  totalPricePlace.innerText = value;
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

function createProductItemElement(sku, name, image, itemsSection) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  itemsSection.appendChild(section);
}

function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
    let priceStr = event.target.innerText;
    priceStr = `-${priceStr.slice(priceStr.indexOf('$') - priceStr.length + 1)}`;
    event.target.remove();
    appendPrice(priceStr);
    localStorage.setItem('shop', document.querySelector(cartItem).innerHTML);
    localStorage.setItem('totalValue', document.querySelector('H2').innerHTML);
  }
}

function createCartItemElement(sku, name, salePrice, cartSection) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  cartSection.appendChild(li);
}

const getItems = async (QUERY, itemsSection) => {
  loadingDiv();
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
  .then((indexResponse) => indexResponse.json().then((response) =>
  response.results.forEach((element) =>
  createProductItemElement(element.id, element.title, element.thumbnail, itemsSection)))
  .then(loadingDiv));
};

const addCartItem = (event) => {
  if (event.target.tagName === 'BUTTON') {
    const cartSec = document.querySelector(cartItem);
    const item = event.target.parentElement.children[0].innerText;
    fetch(`https://api.mercadolibre.com/items/${item}`)
    .then((indexResponse) => indexResponse.json().then((response) => {
      createCartItemElement(response.id, response.title, response.price, cartSec);
      appendPrice(response.price);
      localStorage.setItem('shop', cartSec.innerHTML);
      localStorage.setItem('totalValue', document.querySelector('H2').innerHTML);      
    }));
  }
};

const emptyCart = () => {
  localStorage.clear();
  document.querySelector(cartItem).innerHTML = '';
  document.querySelector('.total-price').innerHTML = '';
};

  window.onload = function onload() { 
// Iniciando códigos para a Seção HTML do carrinho de Compras
  const cartSection = document.querySelector(cartItem);
  if (localStorage.getItem('shop')) {
    cartSection.innerHTML = localStorage.getItem('shop');
    document.querySelector('H2').innerHTML = localStorage.getItem('totalValue'); 
  } 
  cartSection.addEventListener('click', cartItemClickListener);
// Iniciando códigos para a Seção HTML de seleção de itens
  const itemsSection = document.querySelector('.items');
  getItems('computador', itemsSection);
  itemsSection.addEventListener('click', addCartItem);  
// Botão de esvaziar carrinho de compra
  const emptyCartBtn = document.querySelector('.empty-cart');
  console.log(emptyCartBtn);
  emptyCartBtn.addEventListener('click', emptyCart);
};
