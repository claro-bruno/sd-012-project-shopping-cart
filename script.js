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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener({ target }) {
  target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchAPI = () => {
  const createSectionIten = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((arrayPcs) => arrayPcs.results.forEach((itens) =>
  createSectionIten.appendChild(createProductItemElement(itens))));
};

const ol = document.getElementsByClassName('cart__items');

const findId = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((pc) => ol[0].appendChild(createCartItemElement(pc)));
};

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('item__add')) {
    findId(event.target.parentElement.firstChild.innerText);
  }
});

window.onload = function onload() {
  fetchAPI();
};
