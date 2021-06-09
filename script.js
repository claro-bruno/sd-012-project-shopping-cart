const cartList = document.getElementsByClassName('cart__items');
// const totalPriceElement = document.getElementsByClassName('total-price');
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

const GetPrices = async () => {
  const keys = Object.keys(localStorage);
  const items = keys.filter((key) => key.startsWith('MLB'));
  const prices = [];
  const promise = new Promise((resolve, /* reject */) => {
    items.forEach((item) => {
      fetch(`https://api.mercadolibre.com/items/${item}`).then((response) => {
        response.json().then(({ price }) => {
          prices.push(price);
        });
      });
    });
    console.log(`Array dentro da promise ${prices}`);
    resolve(prices);
  });
  return promise;
};

/* const calculateTotal = (prices) => {
  const total = prices.reduce((acc, curr) => acc + curr);
  console.log(total);
} */

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(event) {
  // coloque seu código aqui  
  const words = event.target.innerHTML.split(' ');
  const id = words.filter((word) => word.startsWith('MLB'));  
  localStorage.removeItem(id);  
  cartList[0].removeChild(event.target);  
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(sku, name);
  return li;
}

const addEvent = (event, callback) => {
  const itemAddButtons = document.getElementsByClassName('item__add');
  for (let index = 0; index < itemAddButtons.length; index += 1) {
    itemAddButtons[index].addEventListener(event, callback);
  }
};

const addCartItem = (event) => {
  const section = event.target.parentElement;
  const id = section.firstElementChild.innerHTML;  
  fetch(`https://api.mercadolibre.com/items/${id}`).then((response) => {
    response.json().then((item) => {      
      cartList[0].appendChild(createCartItemElement(item));      
    });
  });
};

const createList = () => {
  const itensSection = document.getElementsByClassName('items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then((response) => {
    response.json().then(({ results }) => {
      for (let index = 0; index < results.length; index += 1) {
        const newSection = createProductItemElement(results[index]);
        itensSection[0].appendChild(newSection);
      }
      addEvent('click', addCartItem);
    });
  });
};

const getCartItems = () => {  
  const keys = Object.keys(localStorage);
  const items = keys.filter((key) => key.startsWith('MLB'));  
  items.forEach((item) => {
    fetch(`https://api.mercadolibre.com/items/${item}`).then((response) => {
      response.json().then((itemAPI) => {        
        cartList[0].appendChild(createCartItemElement(itemAPI));
      });
    });
  });
  GetPrices().then((priceArray) => {
    console.log(`Array retornada da promise: ${priceArray}`);
    // console.log(`Tamanho da array: ${priceArray.length}`);
    // calculateTotal(priceArray);
  });
};

window.onload = function onload() {
  getCartItems();
  createList();
};
