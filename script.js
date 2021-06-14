const QUERY_API = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const ITEM_API = 'https://api.mercadolibre.com/items/';
const ALERT_MSG = 'Não foi possivel concluir sua solicitação, tente novamente!';

// function getStorage() {
//   const cartStorage = localStorage.getItem('cart');
//   goStorage.innerHTML = cartStorage;
// }

const cartItemClickListener = ({ target }) => {
  target.remove();
};

const clearCart = () => { document.querySelector('.cart__items').innerText = ''; };

function loadingRemove() {
  const removeLoading = document.querySelector('.loading');
  removeLoading.remove();
}

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

// // function getSkuFromProductItem(item) {
// //   return item.querySelector('span.item__sku').innerText;
// // }

async function getProductsApi() {
  try {
    const getApi = await fetch(QUERY_API);
    const getApiResults = await getApi.json();
    const resultItem = getApiResults.results;
    loadingRemove();
    const products = document.querySelector('.items');
    resultItem.forEach((element) => {
      const item = createProductItemElement(element);
      products.appendChild(item);
      });
    } catch (error) {
      alert(ALERT_MSG);
  }
}

const itemStorage = document.getElementsByClassName('cart__items');

function storage() {
  localStorage.setItem('cart', itemStorage[0].innerHTML);
}

function getStorage() {
  try { 
    itemStorage[0].innerHTML = localStorage.getItem('cart');
    itemStorage[0].childNodes.forEach((ittem) => ittem
      .addEventListener('click', cartItemClickListener));
  } catch (error) {
    alert(ALERT_MSG);
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  try {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
  } catch (error) {
    alert(ALERT_MSG);
  }
}

async function getElementToCart(itemID) {
  try {
    let elementsChoice = await fetch(`${ITEM_API}${itemID}`);
    elementsChoice = await elementsChoice.json();
    document.getElementsByClassName('cart__items')[0]
      .appendChild(createCartItemElement(elementsChoice));
      storage();
  } catch (error) {
    alert(ALERT_MSG);
  }
}

function addCart() {
  try {
    document.addEventListener('click', ({ target }) => {
      if (target.classList.contains('item__add')) {
        const elementAdd = target.parentElement.firstChild.innerText;
        getElementToCart(elementAdd);
      }
    });
  } catch (error) {
    alert(ALERT_MSG);
  }
}

window.onload = function onload() {
  getProductsApi();
  addCart();
  clearCart();
  getStorage();
};
