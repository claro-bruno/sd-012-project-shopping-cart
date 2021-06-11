let arrayIds = [];

const saveSelection = (event) => {
  localStorage.setItem('item', `${event}`);
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
const ol = document.getElementsByClassName('cart__items');

function cartItemClickListener(event, sku) {
  arrayIds.splice(arrayIds.indexOf(sku), 1);
  event.remove();
  saveSelection(arrayIds);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    cartItemClickListener(event.target, sku);
  });
  return li;
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('empty-cart')) {
    const item = document.querySelectorAll('.cart__item');
    item.forEach((itens) => { 
      itens.remove();
    });
    arrayIds = [];
    saveSelection(arrayIds);
  }
});

const fetchAPI = () => {
  const createSectionIten = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((arrayPcs) => arrayPcs.results.forEach((itens) =>
  createSectionIten.appendChild(createProductItemElement(itens))));
};
  
const findId = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((pc) => ol[0].appendChild(createCartItemElement(pc)));
};

const reloadPage = () => {
  const idSaved = localStorage.getItem('item').split(',');
  console.log(idSaved);
  if (idSaved.length !== []) {
    idSaved.forEach((id) => findId(id));
  }
};

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('item__add')) {
    const id = event.target.parentElement.firstChild.innerText;
    arrayIds.push(id);
    findId(id);
    saveSelection(arrayIds);
  }
});

window.onload = async function onload() {
  await fetchAPI();
  await reloadPage();
};
