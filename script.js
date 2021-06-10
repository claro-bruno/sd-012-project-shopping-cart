const cartItemsElement = '.cart__items'; 
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

const saveCart = () => {
  const sectionCartItemsElement = document.querySelector(cartItemsElement);
  const cartItems = sectionCartItemsElement.children;
  let index = 1;
  localStorage.clear();
  Object.values(cartItems).forEach((item) => {
    localStorage.setItem(index, item.innerText);
    index += 1;
  });
};

const addTotalPrice = (price) => {
  const totalPriceContainer = document.querySelector('.price');
  if (totalPriceContainer.children.length === 0) {
    const totalPriceElement = document.createElement('span');
    totalPriceElement.className = 'total-price';
    totalPriceElement.innerHTML = price;
    totalPriceContainer.appendChild(totalPriceElement);
  } else document.querySelector('.total-price').innerHTML = price;  
};

const sumCartTotalPrice = () => {
  const sectionCartItemsElement = document.querySelector(cartItemsElement);
  const cartItems = sectionCartItemsElement.children;
  if (cartItems.length !== 0) {
    const totalPrice = Object.values(cartItems).reduce((previousValue, nextValue) => {
      const priceNext = parseFloat((nextValue.innerText.split('PRICE: $')[1]), 10);
      return previousValue + priceNext;
    }, 0);
    const fomatedPrice = parseFloat(totalPrice.toFixed(2));
    addTotalPrice(fomatedPrice);
  } else {
    const totalPrice = 0;
    const fomatedPrice = parseFloat(totalPrice.toFixed(2));
    addTotalPrice(fomatedPrice);
  }
};

function cartItemClickListener(event) {
  const sectionCartItemsElement = document.querySelector(cartItemsElement);
  const cartItemElement = event.target;
  sectionCartItemsElement.removeChild(cartItemElement);
  sumCartTotalPrice();
  saveCart();
}

const loadCart = (cartItem) => {
  const sectionCartItemsElement = document.querySelector(cartItemsElement);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `${cartItem}`;
  li.addEventListener('click', cartItemClickListener);
  sectionCartItemsElement.appendChild(li);
};

const verifyLocalStorage = () => {
  if (localStorage.length !== 0) {
    for (let index = 1; index <= localStorage.length; index += 1) {
      loadCart(localStorage.getItem(index));
    }
  }
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addCartItemElement = (cartItemElement) => {
  const sectionCartItemsElement = document.querySelector(cartItemsElement);
  sectionCartItemsElement.appendChild(cartItemElement);
  sumCartTotalPrice();
  saveCart();
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

const createTotalPriceContainer = () => {
  const cartElement = document.querySelector('.cart');
  const totalPriceContainer = document.createElement('div');
  totalPriceContainer.className = 'price';
  totalPriceContainer.innerHTML = 'Preço total: $';
  cartElement.appendChild(totalPriceContainer);
  sumCartTotalPrice();
};

const emptyCart = () => {
  const cartSection = document.querySelector(cartItemsElement);
  while (cartSection.firstChild) cartSection.removeChild(cartSection.firstChild);
  sumCartTotalPrice();
  saveCart();
};

window.onload = function onload() {
  fetchListOfProducts();
  verifyLocalStorage();
  createTotalPriceContainer();
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
};
