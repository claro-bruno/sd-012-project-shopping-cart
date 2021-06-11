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
//  ID, title e thumbnail
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

// function getSkuFromProductItem(item) {
//     return item.querySelector('span.item__sku').innerText;
// }
  
function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchItem = async (id) => {
  const API_URL = `https://api.mercadolibre.com/items/${id}`;
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  const selectOl = document.querySelector('.cart__items');

  await fetch(API_URL, myObject)
    .then((response) => response.json())
    .then(async (data) => {
      selectOl.appendChild(createCartItemElement(data));
    });
};

const selectButton = () => {
  const botaoAdd = document.querySelectorAll('.item__add');
  botaoAdd.forEach((botao) => botao.addEventListener('click', function (event) {
    fetchItem(event.target.parentNode.firstChild.innerText);
  }));
};

const fetchMl = async () => {
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  const pegarItems = document.querySelector('.items');

  await fetch(API_URL, myObject)
    .then((response) => response.json())
    .then((data) => (data.results))
    .then((itens) => itens
      .forEach((evento) => pegarItems.appendChild(createProductItemElement(evento))));
};

window.onload = async () => {
  await fetchMl();
  selectButton();
};