const BASE_API = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const BASE_ITEM = 'https://api.mercadolibre.com/items';
const sectionItens = document.querySelector('.items');
const liItens = document.querySelector('.cart__items');

// requisisto 1
const fetchApi = (item) => fetch(`${BASE_API}${item}`)
  .then((response) => response.json())
  .then((items) => items.results)
  .catch((error) => error);

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
// fim requisito 1
// ------------------------------------------
// inicia requisisto 2
const saveListCart = () => {
  localStorage.setItem('cart', liItens.innerHTML);
};

function cartItemClickListener(event) {
  const olItems = document.querySelectorAll('.cart__items');
  console.log(olItems);

  const targetClicked = event.target;
  targetClicked.remove();
  saveListCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // liItens.addEventListener('click', cartItemClickListener);
  return li;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const getItem = (id) => fetch(`${BASE_ITEM}/${id}`)
  .then((response) => response.json())
  .then((item) => item)
  .catch((error) => error);

const creatItemList = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((e) => {
    e.addEventListener('click', async (ev) => {
      try {
        const id = ev.target.parentElement.querySelector('.item__sku').innerText;
        const data = await getItem(id);
        liItens.appendChild(createCartItemElement(data));
        saveListCart();
      } catch (error) {
        console.log(error);
      }
    });
  });
};
// finaliza requisito 2

const teste = () => {
  liItens.addEventListener('click', cartItemClickListener);
};

window.onload = function onload() {
  fetchApi('computador')
    .then((items) => {
      items.forEach((item) => {
        sectionItens.appendChild(createProductItemElement(item));
      });
      creatItemList();
    })

    .catch((error) => console.log(`o erro foi ${error}`));

  const test = localStorage.getItem('cart');
  liItens.innerHTML = test;
  teste();
};
