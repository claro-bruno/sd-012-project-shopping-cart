let productList;

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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

/* function cartItemClickListener(event) {
  // coloque seu código aqui
} */

/* function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */

const addProductItemElement = (productElement) => {
  const sectionItemsElement = document.querySelector('.items');
  sectionItemsElement.appendChild(productElement);
};

const formatRequiredObject = (receivedListObjects) => receivedListObjects.map((product) => {
  const formatedObject = {
    name: product.title,
    sku: product.id,
    image: product.thumbnail,
  };
  return formatedObject;
});

const getProductPromisse = (product) => new Promise((resolve, reject) => {
  if (product !== 'computador') {
    reject(new Error('Product out of context'));
  } else {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`).then((response) => {
      response.json().then((productFound) => {
        const requiredListObject = [...productFound.results];
        productList = formatRequiredObject(requiredListObject);
        productList.forEach((productItem) => {
          addProductItemElement(createProductItemElement(productItem));
        });
        resolve();
      });
    });
  }
});

const fetchListOfProducts = async () => {
try {
  await getProductPromisse('computador');
} catch (errorMsg) {
  console.log(errorMsg);
}
};

window.onload = function onload() {
  fetchListOfProducts();
};
