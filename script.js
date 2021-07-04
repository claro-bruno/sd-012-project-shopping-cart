const BASE_API = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const BASE_ITEM = 'https://api.mercadolibre.com/items';
const sectionItens = document.querySelector('.items');
const liItens = document.querySelector('.cart__items');
const spanTotalPrice = document.querySelector('.total-price');

const fetchApi = (item) => {
  // Consultei o repositório do Cristiano lima como inspiração para resolução do requisito 7 sobre o loading antes do fetch https://github.com/tryber/sd-012-project-shopping-cart/pull/116
  const loading = document.querySelector('.loading');
  loading.innerText = 'Loading...';
  return fetch(`${BASE_API}${item}`)
    .then((response) => response.json())
    .then((items) => {
      loading.parentElement.removeChild(loading);
      return items.results;
    })
    .catch((error) => error);
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
  // consultei o repositório do Andre Moreno para resolver parte desta função https://github.com/tryber/sd-012-project-shopping-cart/pull/37
  liItens.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      const arrSplit = event.target.innerText.split('$');
      const priceItemList = arrSplit[arrSplit.length - 1];
      const totalPrice = document.querySelector('.total-price').innerText;
      const sub = parseFloat(totalPrice) - priceItemList;
      const subRound = Math.round(sub * 100) / 100;
      spanTotalPrice.innerText = subRound;
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

const sumPriceItensCart = (price = 0) => {
  // Consultei documentaçãoo para entender sobre o Math.round https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/round
  let totalPrice = localStorage.getItem('total_price');
  if (typeof (totalPrice) !== 'string') {
    console.log('ops, algum erro no local storage');
    totalPrice = '0';
  }
  const sum = Math.round((parseFloat(totalPrice) + price) * 100) / 100;
  localStorage.setItem('total_price', sum);
  spanTotalPrice.innerText = `${sum}`;
};

function getIdFormProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const creatItemList = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      try {
        const idProduct = getIdFormProductItem(event.target.parentElement);
        const data = await fetchItemById(idProduct);
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

const emptyCart = () => {
  const btnEmptyCart = document.querySelector('.empty-cart');
  btnEmptyCart.addEventListener('click', () => {
    const itemsCart = document.querySelectorAll('.cart__item');
    itemsCart.forEach((item) => {
      item.parentNode.removeChild(item);
      spanTotalPrice.innerText = 0;
      setItemStorage();
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
  emptyCart();
};