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
// fim requisito 1 ------------------------------------------

const setItemStorage = () => {
  localStorage.setItem('cart', liItens.innerHTML);
};

const getItemStorage = () => {
  liItens.innerHTML = localStorage.getItem('cart');
};

function cartItemClickListener() {
  liItens.addEventListener('click', (event) => {
    event.target.remove();
    setItemStorage();
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

const fetchItemById = (id) => fetch(`${BASE_ITEM}/${id}`)
  .then((response) => response.json())
  .then((item) => item)
  .catch((error) => error);

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const creatItemList = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      try {
        const id = getSkuFromProductItem(event.target.parentElement);
        const data = await fetchItemById(id);
        liItens.appendChild(createCartItemElement(data));
        setItemStorage();
      } catch (error) {
        console.log(`o erro foi ${error}`);
      }
    });
  });
};
// finaliza requisito 2

window.onload = () => {
  fetchApi('computador')
    .then((items) => {
      items.forEach((item) => {
        sectionItens.appendChild(createProductItemElement(item));
      });
      creatItemList();
    })
    .catch((error) => console.log(`o erro foi ${error}`));

  getItemStorage();
  cartItemClickListener();
};