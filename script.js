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

function cartItemClickListener(event) {
  const sectionCartItemsElement = document.querySelector('.cart__items');
  const cartItemElement = event.target;
  sectionCartItemsElement.removeChild(cartItemElement);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCartItemElement = (cartItemElement) => {
  const sectionCartItemsElement = document.querySelector('.cart__items');
  sectionCartItemsElement.appendChild(cartItemElement);
};

const formatCartItemObject = (receivedCartItemObject) => {
    const formatedObject = {
      name: receivedCartItemObject.title,
      sku: receivedCartItemObject.id,
      salePrice: receivedCartItemObject.price,
    };
    return formatedObject;
};

/* const addEventToItens = () => {
  document.querySelectorAll('.cart__item').forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}; */

const getCartItensPromisse = (sku) => new Promise((resolve, reject) => {
  if (!sku.startsWith('MLB')) {
    reject(new Error('SKU informed does not exist'));
  } else {
    fetch(`https://api.mercadolibre.com/items/${sku}`).then((response) => {
      response.json().then((carItemFound) => {
        const cartItemObject = formatCartItemObject({ ...carItemFound });
        addCartItemElement(createCartItemElement(cartItemObject));
        // addEventToItens();
        resolve();
      });
    });
  }
});

const fetchCartItens = async (sku) => {
  try {
    await getCartItensPromisse(sku);
  } catch (errorMsg) {
    console.log(errorMsg);
  }
};

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

const addEventToButtons = () => {
  document.querySelectorAll('.item__add').forEach((item) => {
    item.addEventListener('click', (event) => {
      const sku = event.target.parentElement.firstChild.innerText;
      fetchCartItens(sku);
    });
  });
};

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
        addEventToButtons();
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
