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

async function fetchProductArrayFromURL(URL, product) {
  const response = await fetch(`${URL}${product}`);
  const json = await response.json();
  return json;
}

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
    totalPriceElement.innerHTML = parseFloat(savedTotal);
    totalPrice = parseFloat(savedTotal);
  }
};

const showResults = (results) => results
  .forEach((result) => itemsSection
    .appendChild(createProductItemElement(result)));

const loadResults = async () => {
  const { results } = await fetchProductArrayFromURL(
    'https://api.mercadolibre.com/sites/MLB/search?q=',
    'computador',
  );
  return results;
};

const emptyCart = () => {
  while (shoppingCartList.firstChild) {
    shoppingCartList.removeChild(shoppingCartList.firstChild);
  }
};

const addEmptyCartButtonClickListener = () => {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', () => {
    emptyCart();
    showAndStoreTotalPrice(0);
    localStorage.clear();
    totalPrice = 0;
  });
};

window.onload = async function onload() {
  totalPriceElement = document.querySelector('.total-price');
  shoppingCartList = document.querySelector('#cart');
  itemsSection = document.querySelector('.items');
  loadLocalStorage();
  const results = await loadResults();
  showResults(results);
  addResultsClickListeners(results);
  addEmptyCartButtonClickListener();
};
/* 

promise: obrigatoriamente tem que chamar resolve() e reject(), senão fica pending pra sempre em loop

devem ser chamados no retorno de uma promise
.then((result) => {})
.catch((error) => {})

async/await
precisa de try catch

debbugar o fetch

const e await
e try catch para erro

const fulano = await getGithubUser();
fulano é o próprio response
fulano.json retorna uma promise

TODA VEZ QUE SE RETORNAR UMA PROMISE ASSINCRONA, TENHO QUE RESOLVER (SINCRONIZAR) COM .THEN OU ASYNC AWAIT

englobar retorno da fetch em uma nova promise

 */
