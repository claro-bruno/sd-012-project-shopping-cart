let arrayCartList;

const getCartItems = () => {
  // const valueLi = document.querySelectorAll('.cart__items').value;
  const localStorageCart = localStorage.getItem('Cart');
  if (localStorageCart === null || localStorageCart === '') {
    arrayCartList = [];
    localStorage.setItem('Cart', arrayCartList);
  } else {
    const localStorageConvert = JSON.parse(localStorageCart);
    arrayCartList = localStorageConvert;
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

// function getSkuFromProductItem(item) { // ???
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener() { // o produto do carrinho é removido ao ser clicado. (remover class: projeto to-do-list)
  const acessFather = document.querySelector('#cart__items');
  const accessChild = document.querySelector('.cart__item');
  acessFather.removeChild(accessChild);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) { // esses elementos devem estar na hierarquia de <ol class="cart__items"></ol>, no carrinho de compras.
  const cart = document.getElementById('cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  cart.appendChild(li);
  li.addEventListener('click', cartItemClickListener); // ao clicar em um item com classe 'li', chama a função 'cartItemClickListener' que remove o 'li' do carrinho.
  return li;
}

function addToArray(obj) {
  arrayCartList.push(obj); // adiciona cada objeto ao arrayCartList
  localStorage.setItem('Cart', JSON.stringify(arrayCartList)); // converte 
}

const fetchObject = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((obj) => {
    addToArray(obj);
    createCartItemElement(obj);
  });
};
// requisito 5
function calc() {
  let total = 0;
  const itemsForCalc = document.querySelectorAll('.cart__item');
  itemsForCalc.forEach((item) => {
    const preco = Number(item.innerHTML.slice(item.innerHTML.indexOf('$') + 1));
    total += preco;
  });
  const sumTotal = document.querySelector('.total-price');
  sumTotal.innerText = total;
}

const getToCarList = () => {
  const eachButtun = document.querySelectorAll('.item__add');
   eachButtun.forEach((button) => button.addEventListener('click', async ({ target }) => {
     await fetchObject(target.parentNode.firstChild.innerText);
     calc();
    }));
  };

const fetchResults = () => {
  const getParent = document.getElementsByClassName('items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((array) => array.results.forEach((item) => getParent[0]
  .appendChild(createProductItemElement(item)))).then(() => getToCarList());
};

window.onload = function onload() {
  calc();
  fetchResults();
  arrayCartList.forEach((item) => createCartItemElement(item));
};