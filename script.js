function cartItemClickListener(event) {
  // fazer depois
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemCart(item) {
  const ol = document.querySelector('.cart__items');
  ol.appendChild(item);
}

const loadProductsAPI = async (url) => {
  try {
    const result = await fetch(url);
    const resultJson = await result.json();

    if (resultJson.results) {
      return resultJson.results;
    }
    return resultJson;
  } catch (error) {
    console.log(error);
  }
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function getProductId(event) {
  if (event.target.className === 'item__add') {
    const id = getSkuFromProductItem(event.target.parentElement);
    const item = await loadProductsAPI(`https://api.mercadolibre.com/items/${id}`);
    addItemCart(createCartItemElement(item));
  }
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

async function addProducts(url) {
  const sectionItems = document.querySelector('.items');
  const computers = await loadProductsAPI(url);

  computers.forEach((computer) => {
    sectionItems.appendChild(createProductItemElement(computer));
  });

  sectionItems.addEventListener('click', getProductId);
}

window.onload = () => {
  addProducts('https://api.mercadolibre.com/sites/MLB/search?q=computador');
};