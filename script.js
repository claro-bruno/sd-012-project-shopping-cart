let totalPriceElement;
let shoppingCartList;
let itemsSection;
let totalPrice = 0;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerHtml) {
  const e = document.createElement(element);
  e.className = className;
  e.innerHTML = innerHtml;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

const showAndStoreTotalPrice = (totalPricex) => {
  totalPriceElement.innerHTML = Number(totalPricex);
  localStorage.setItem('totalPrice', Number(totalPricex));
};

const addPrice = (productPrice) => {
  console.log(totalPrice, productPrice);
  totalPrice += productPrice;
  showAndStoreTotalPrice(totalPrice);
};

const removePrice = (event) => {
  totalPrice -= parseFloat(event.target.innerHTML.split('$')[1]);
  showAndStoreTotalPrice(totalPrice);
};

const emptyCart = () => {
  while (shoppingCartList.firstChild) {
    shoppingCartList.removeChild(shoppingCartList.firstChild);
  }
};

function cartItemClickListener(event) {
  removePrice(event);
  event.target.remove();
  localStorage.setItem('shoppingCartList', shoppingCartList.innerHTML);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addEmptyCartButtonClickListener = () => {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', () => {
    emptyCart();
    showAndStoreTotalPrice(0);
    localStorage.clear();
    totalPrice = 0;
  });
};

const showResults = (results) => results
  .forEach((result) => itemsSection
    .appendChild(createProductItemElement(result)));

const showOrHideLoading = (string) => {
  const loadingElement = document.querySelector('.loading');
  if (string === 'show') {
    loadingElement.innerHTML = 'loading...';
  } else {
    loadingElement.remove();
  }
};

const fetchProductArrayFromURL = async (URL, product) => {
  const response = await fetch(`${URL}${product}`);
  const productsJson = await response.json();
  return productsJson;
};

const addResultsClickListeners = (results) => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button, index) => {
    button.addEventListener('click', async () => {
      const productJSON = await fetchProductArrayFromURL(
        'https://api.mercadolibre.com/items/', results[index].id,
      );
      addPrice(productJSON.price);
      shoppingCartList.appendChild(createCartItemElement(productJSON));
      localStorage.setItem('shoppingCartList', shoppingCartList.innerHTML);
    });
  });
};

const loadResults = async () => {
  showOrHideLoading('show');
  const { results } = await fetchProductArrayFromURL(
    'https://api.mercadolibre.com/sites/MLB/search?q=',
    'computador',
    );
    return results;
  };
  
const loadLocalStorage = () => {
  const savedCart = localStorage.getItem('shoppingCartList');
  if (savedCart) {
    shoppingCartList.innerHTML = savedCart;
    const savedCartListItems = document.querySelectorAll('.cart__item');
    savedCartListItems.forEach((savedCartListItem) => {
      savedCartListItem.addEventListener('click', cartItemClickListener);
      });
  }
  const savedTotal = localStorage.getItem('totalPrice');
  if (savedTotal) {
    totalPriceElement.innerHTML = Number(savedTotal);
    totalPrice = Number(savedTotal);
  }
};

window.onload = async function onload() {
  totalPriceElement = document.querySelector('.total-price');
  shoppingCartList = document.querySelector('#cart');
  itemsSection = document.querySelector('.items');
  loadLocalStorage();
  const results = await loadResults();
  showOrHideLoading('hide');
  showResults(results);
  addResultsClickListeners(results);
  addEmptyCartButtonClickListener();
};
