const items = document.querySelector('.items');
const loading = document.querySelector('.loading');
const cart = document.querySelector('.cart__items');
// const addItem = document.querySelector('.item__add');
// const totalPrice = document.querySelector('.total-price');
const emptyCart = document.querySelector('.empty-cart');

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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

/* requisito 5
 Consultei o resositório de Rafael Bamberg para resolver esse.
 Link: https://github.com/tryber/sd-011-project-shopping-cart/pull/192

/* A partir do valor inicial de 0, para cada item do array cart-item, o preço total somado
é exibido na tela a partir do valor inicial de 0 atraves da iteração a cada item do array do carrinho
como forEach, retornando o preço total em total-price.
Foi preciso arredondar os valores e fixar em duas casas decimais para que os valores somados fiquem precisos no cálculo.
Na linha 55 o uso de split para dividir a string onde encontram-se os dados de cada produto,
foi utilizado ('$')[1] para que cada caractere correspondente a $ (o parametro do split) retorne somente os preços dos produtos,
separando dos demais dados, sem isso o resultado da somatória total retorna NaN porque
o codigo nao identifica o que tem que ser retornado.
*/
function totalPrice() {
  const cartItem = document.querySelectorAll('.cart__item');
  let count = 0;
  cartItem.forEach((item) => {      
    const value = parseFloat(item.innerHTML.split('$')[1]);
    count = value + count;
    return count.toFixed(2);
  });
  const total = document.querySelector('.total-price');
  total.innerHTML = count;
 }

// requisito 3
function cartItemClickListener(event) {
  const removeItem = event.target;
  removeItem.parentNode.removeChild(event.target);
  totalPrice(); // requisito 5
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 2
async function fetchCartItems(ItemID) {
  const cartItems = document.querySelector('.cart__items');
  const response = await fetch(`https://api.mercadolibre.com/items/${ItemID}`);
   const computer = await response.json();
   cartItems.appendChild(createCartItemElement(computer));
   totalPrice(); // requisito 5
}

// requisito 6
function removeCartItems() {
  emptyCart.addEventListener('click', () => {
    cart.innerHTML = '';
    totalPrice(); // requisito 5
  });
}

// requisito 2
const addToCart = () => {
  const addItem = document.querySelectorAll('.item__add');
  addItem.forEach((button) => {
    button.addEventListener('click', (event) => {
      const item = event.target.parentElement.querySelector('.item__sku').innerText;
      fetchCartItems(item).then((product) => createCartItemElement(product));
      totalPrice(); // requisito 5  
    });
  });
};

// requisito 7
function loadingCart() {
  loading.remove();
}

// requisito 1
async function fetchAPI() {
    const fetchML = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const getResponse = await fetchML.json();
    const productItem = getResponse.results;
   productItem.forEach((product) => items.appendChild(createProductItemElement(product)));
   loadingCart(); // requisito 7
  }
    
window.onload = function onload() {
  fetchAPI()
  .then(() => addToCart())
  .then(() => removeCartItems())
  .then(() => totalPrice());
};