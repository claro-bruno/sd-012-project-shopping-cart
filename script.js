const sectionItems = document.querySelector('.items');
const ol = document.querySelector('.cart__items');
let priceTotal = 0;

const spanPrice = document.createElement('span');
spanPrice.className = 'total-price';
document.querySelector('.cart').appendChild(spanPrice);

const totalPrice = document.createElement('p');
totalPrice.innerText = priceTotal;
document.querySelector('.total-price').appendChild(totalPrice);

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getProductsAPI = async (url) => {
  try {
    const resultsApi = await fetch(url);
    const objResults = await resultsApi.json();
    return objResults.results.forEach((item) => {
      const itemInfos = {
        sku: item.id,
        name: item.title,
        image: item.thumbnail,
      };
      sectionItems.appendChild(createProductItemElement(itemInfos));
    });
  } catch (error) {
    console.log(error.message);
  }
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event, salePrice) {
  priceTotal -= salePrice;
  totalPrice.innerText = priceTotal;
  event.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    cartItemClickListener(event.target, salePrice);
  });
  return li;
}

const createItemForCart = async (product) => {
  const skuItem = getSkuFromProductItem(product);
  try {
    const infosItemApi = await fetch(`https://api.mercadolibre.com/items/${skuItem}`);
    const objInfosItem = await infosItemApi.json();
    const itemInfos = {
      sku: objInfosItem.id,
      name: objInfosItem.title,
      salePrice: objInfosItem.price,
    };
    priceTotal += itemInfos.salePrice;
    totalPrice.innerText = priceTotal;
    return ol.appendChild(createCartItemElement(itemInfos));
  } catch (error) {
    console.log(error.message);
  }
};

const addItemToCart = () => {
  sectionItems.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const product = event.target.parentElement;
      createItemForCart(product);
    }
  });
};

// setInterval(() => {
//   localStorage.setItem('itemsInCart', document.querySelector('.cart__items').innerHTML);
// }, 500);

// const loadCart = () => {
//   const array = localStorage.getItem('itemsInCart');
  
//   console.log(typeof(array));
//   console.log(array);
// };

window.onload = async function onload() {
  await getProductsAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  // await loadCart();
  await addItemToCart();
};