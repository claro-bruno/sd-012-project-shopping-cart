const pc = document.querySelector('.items');
const botaoAddCarrinho = document.getElementsByClassName('item__add');
const cartItems = document.getElementsByClassName('cart__items');

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // desestruturação do objeto para acessar as 3 propriedades
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku)); //  tipo:span classe:item conteudo:sku
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fet = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador') 
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach((element) => {
      pc.appendChild(createProductItemElement(element));
    });
  }); 
};

const carrinho = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach((element) => {
      cartItems.appendChild(createCartItemElement(element));
    });
  });
};

const botaoAdd = async () => {
  
};

window.onload = function onload() { fet(); };