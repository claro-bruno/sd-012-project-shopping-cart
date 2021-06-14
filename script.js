const sectionItems = document.querySelector('.items');

const ol = document.querySelector('.cart__items');

let priceTotal = 0;

const spanPrice = document.createElement('span');
spanPrice.className = 'total-price';
document.querySelector('.cart').appendChild(spanPrice);

const totalPrice = document.createElement('p');
totalPrice.innerText = priceTotal;
document.querySelector('.total-price').appendChild(totalPrice);

const loading = document.createElement('p');
loading.className = 'loading';
loading.innerText = 'loading...';

const saveCart = () => {
  localStorage.setItem('cartItems', JSON.stringify(ol.innerHTML));
  localStorage.setItem('priceCartItems', JSON.stringify(priceTotal));
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  // Melhora a qualidade da imagem
  /* Linha de código indicada pelo colega Caio Morato (Nuwanda) da Turma 12
  Link da postagem onde ele faz a indicação:
  https://trybecourse.slack.com/archives/C01T2C18DSM/p1623614170092700 */
  const img = image.replace(/-I.jpg/g, '-O.jpg');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(img));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getProductsAPI = async (url) => {
  document.querySelector('.items').appendChild(loading);
  try {
    const resultsApi = await fetch(url);
    const objResults = await resultsApi.json();
    document.querySelector('.items').removeChild(loading);
    objResults.results.forEach((item) => {
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
  saveCart();
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
    ol.appendChild(createCartItemElement(itemInfos));
    saveCart();
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

const clearButton = document.querySelector('.empty-cart');
clearButton.addEventListener('click', () => {
  const items = document.querySelectorAll('.cart__item');
  items.forEach((item) => ol.removeChild(item));
  priceTotal = 0;
  totalPrice.innerText = priceTotal;
  saveCart();
});

const loadCart = async () => {
  ol.innerHTML = JSON.parse(localStorage.getItem('cartItems'));
  const savedLi = document.querySelectorAll('.cart__item');
  savedLi.forEach((li) => {
    li.addEventListener('click', (event) => {
      const originalPrice = Number(event.target.innerText.split('$')[1]);
      const salePrice = Math.round(originalPrice * 100) / 100;
      console.log(salePrice);
      cartItemClickListener(event.target, salePrice);
    });
  });
  const originalPrice = Number(JSON.parse(localStorage.getItem('priceCartItems')));
  priceTotal = Math.round(originalPrice * 100) / 100;
  totalPrice.innerText = priceTotal;
};

window.onload = async function onload() {
  await getProductsAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  await loadCart();
  addItemToCart();
};
