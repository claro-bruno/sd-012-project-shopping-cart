const API_COMPUTADOR = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const olTotalPrice = document.querySelector('.total-price');
const olCartItems = document.querySelector('.cart__items');
const buttonEmptyCart = document.querySelector('.empty-cart');
let arrayShoppingCart;

/**+
 * Esta parte do código teve a colaboração de Igor Fernandes.
 */
function calc() {
  let total = 0;
  const itemsForCalc = document.querySelectorAll('.cart__item');
  itemsForCalc.forEach((item) => {
    const priceItem = Number(item.innerHTML.slice(item.innerHTML.indexOf('$') + 1));
    total += priceItem;
  });
  olTotalPrice.innerText = total;
}

/**
 * Esta parte foi baseada no código de Daniel Batista.
 * https://github.com/tryber/sd-012-project-shopping-cart/pull/91
 */
const getCartItems = () => {
  const localStorageCart = localStorage.getItem('Cart');
  if (localStorageCart === null || localStorageCart === '') {
    arrayShoppingCart = [];
    localStorage.setItem('Cart', arrayShoppingCart);
  } else {
    const localStorageConvert = JSON.parse(localStorageCart); // Transforma de JSON para javascript
    arrayShoppingCart = localStorageConvert;
  }
};
getCartItems();

function createProductImageElement(imageSource) { // cria elemento do tipo img
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element); // que tipo de elemento é criado e quando?
  e.className = className; // não entendi: acessa o elemento 'e' e define um className?
  e.innerText = innerText; // não entendi: acessa o elemento 'e' e define um className?
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // define hierarquia etre elementos filhos de classe 'item' e elemento pai section de classe 'items'
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image.replace('I.jpg', 'O.jpg')));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText; // captura o id do span
}

/**
 * Requisito 6 resolvido com a colaboração de David Gonzaga.
 */

function clear() {
  olCartItems.innerHTML = '';
  arrayShoppingCart = [];
  localStorage.setItem('Cart', JSON.stringify(arrayShoppingCart));
  calc();
}

buttonEmptyCart.addEventListener('click', clear);

/**
 * Parte do requisito 5 resolvido com a colaboração de: David Gonzaga.
 */

function removeItemFromArrayById(idObj) {
  arrayShoppingCart = arrayShoppingCart.filter(({ id }) => id !== idObj); // retorna array com itens com 'id' diferente de 'idObj'. Retorna todos os idObj, exceto aquele que é !== de 
  localStorage.setItem('Cart', JSON.stringify(arrayShoppingCart)); // setItem: acessa e altera o localstorage. JSON.stringify(arrayShoppingCart): transforma em JSON.
}

/**
 * Parte do requisito 5 resolvido com a colaboração de: David Gonzaga, Caroline Benichio.
 */

function cartItemClickListener({ target }) { // o produto do carrinho é removido ao ser clicado. Usando event.target desestruturado: { target }.
  const alvo = target; // 
  const idObj = alvo.innerText.split('|')[0].slice(5).trim(); // o
  olCartItems.removeChild(alvo);
  removeItemFromArrayById(idObj);
  calc();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) { // Cria os elementos HTML. Esses elementos devem estar na hierarquia de <ol class="cart__items"></ol>, no carrinho de compras.
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  olCartItems.appendChild(li);
  li.addEventListener('click', cartItemClickListener); // ao clicar em um item 'li' com classe 'cart__item', chama a função 'cartItemClickListener' que remove o nó filho 'li' do carrinho <ol class="cart__items"></ol>.
  return li;
}

function pushToArrayShoppingCart(objByID) {
  arrayShoppingCart.push(objByID); // adiciona cada objeto ao arrayShoppingCart
  localStorage.setItem('Cart', JSON.stringify(arrayShoppingCart));
}

const fetchObjectById = async ({ target }) => {
  const id = getSkuFromProductItem(target.parentElement);
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const objectById = await response.json();
    pushToArrayShoppingCart(objectById);
    createCartItemElement(objectById);
    calc();
};

const addEventListenerToObjectId = () => {
  const itemButtun = document.querySelectorAll('.item__add');
  itemButtun.forEach((button) => {
    button.addEventListener('click', fetchObjectById);
  });
};

const fetchApiComputador = async () => {
  const sectionFather = document.getElementsByClassName('items')[0]; // primeira tag <section> do array de getElementsByClassName.
  /**
   * Requisito 7: tag <p> loading com a colaboração de David Gonzaga.
   */
  sectionFather.innerHTML = '<p class="loading">loadin...<p/>'; // enquanto a promessa não se cumpre, a tag com o texto loading, está aparecendo.
  const responseComputador = await fetch(API_COMPUTADOR);
  const responseComputadorJSON = await responseComputador.json();
  const listComputadores = responseComputadorJSON.results;
    sectionFather.innerHTML = ''; // após a promessa se cumprir, o innerHTML se torna vazio.
    listComputadores.forEach((item) => {
      const product = createProductItemElement(item);
      sectionFather.appendChild(product);
      addEventListenerToObjectId();
    });
};

window.onload = function onload() {
  fetchApiComputador();
  arrayShoppingCart.forEach((item) => createCartItemElement(item));
  calc();
};