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
  if (event.target.className === 'cart__item') event.target.remove();
}

function createCartItemElement(sku, name, salePrice) {
  const cartSection = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
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
    const item = event.target.parentElement.children[0].innerText;
    fetch(`https://api.mercadolibre.com/items/${item}`)
    .then((indexResponse) => indexResponse.json().then((response) => 
      createCartItemElement(response.id, response.title, response.price)));
  }
};

  window.onload = function onload() { 
  const itemsSection = document.querySelector('.items');
  getComputerItems('computador', itemsSection);
  itemsSection.addEventListener('click', addCartItem);
  console.log('aqui');
  };
