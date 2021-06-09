const cartItem = '.cart__items';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
    event.target.remove();
    localStorage.setItem('shop', document.querySelector(cartItem).innerHTML);
  }
}

function createCartItemElement(sku, name, salePrice, cartSection) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  cartSection.appendChild(li);
}

const getComputerItems = async (QUERY, itemsSection) => 
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
  .then((indexResponse) => indexResponse.json().then((response) => 
  response.results.forEach((element) => { 
    createProductItemElement(element.id, element.title, element.thumbnail, itemsSection);
  })));  

const addCartItem = (event) => {
  if (event.target.tagName === 'BUTTON') {
    const cartSection = document.querySelector(cartItem);
    const item = event.target.parentElement.children[0].innerText;
    fetch(`https://api.mercadolibre.com/items/${item}`)
    .then((indexResponse) => indexResponse.json().then((response) => {
      createCartItemElement(response.id, response.title, response.price, cartSection);
      console.log(cartSection.innerHTML);
      localStorage.setItem('shop', cartSection.innerHTML);
    }));
  }
};

  window.onload = function onload() { 
// Iniciando códigos para a Seção HTML do carrinho de Compras
  const cartSection = document.querySelector(cartItem);
  cartSection.innerHTML = localStorage.getItem('shop');
  cartSection.addEventListener('click', cartItemClickListener);
// Iniciando códigos para a Seção HTML de seleção de itens
  const itemsSection = document.querySelector('.items');
  getComputerItems('computador', itemsSection);
  itemsSection.addEventListener('click', addCartItem);
  };
