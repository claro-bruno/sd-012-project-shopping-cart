const BASE_API = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const BASE_ITEM = 'https://api.mercadolibre.com/items';
const sectionItens = document.querySelector('.items');
const liItens = document.querySelector('.cart__items');
const spanTotalPrice = document.querySelector('.total_price');
console.log(spanTotalPrice);

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

const setItemStorage = () => {
  localStorage.setItem('cart', liItens.innerHTML);
  localStorage.setItem('total_price', spanTotalPrice.innerHTML);
};

const getItemStorage = () => {
  liItens.innerHTML = localStorage.getItem('cart');
  const totalPrice = localStorage.getItem('total_price');
  if (!totalPrice) {
    spanTotalPrice.innerHTML = 0;
  } else {
    spanTotalPrice.innerHTML = totalPrice;
  }
};

function removeItemCart() {
  liItens.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      event.target.remove();
      setItemStorage();
    }
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

function getIdFormProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const sumPriceItensCart = (price = 0) => {
  let totalPrice = localStorage.getItem('total_price');
  if (typeof (totalPrice) !== 'string') {
    console.log('ops');
    totalPrice = '0';
  }
  const sum = parseInt(totalPrice, 10) + price;
  localStorage.setItem('total_price', sum);
  spanTotalPrice.innerText = `${sum}`;
};

sumPriceItensCart();

const subPriceItensCart = (price = 0) => {
  let totalPrice = localStorage.getItem('total_price');
  if (typeof (totalPrice) !== 'string') {
    console.log('ops');
    totalPrice = '0';
  }
  const sub = parseInt(totalPrice, 10) - price;
  localStorage.setItem('total_price', sub);
  spanTotalPrice.innerText = `${sub}`;
};

subPriceItensCart(1000);

const creatItemList = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      try {
        const id = getIdFormProductItem(event.target.parentElement);
        const data = await fetchItemById(id);
        liItens.appendChild(createCartItemElement(data));
        const { price } = data;
        sumPriceItensCart(price);
        setItemStorage();
      } catch (error) {
        console.log(`o erro foi ${error}`);
      }
    });
  });
};

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
  removeItemCart();
};