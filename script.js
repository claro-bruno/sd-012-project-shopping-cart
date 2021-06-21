const items = document.querySelector('.items');
items.innerHTML = '<span class="loading">Loading</span>';
const cartItems = document.querySelector('.cart__items');
const itemsCart = document.getElementsByClassName('cart__item');
const sectionItem = document.querySelector('.cart');
const buttonClear = document.querySelector('.empty-cart');

let sum = 0;
const localString = localStorage.getItem('totalcarrinho');
if (localString !== null) {
  sum = parseFloat(localString);
}

const result = document.createElement('p');
result.innerText = 'TOTAL:';
sectionItem.appendChild(result);

const total = document.createElement('span');
total.className = 'total-price';
total.innerText = 0;
result.appendChild(total);

const saveLocalStorage = localStorage.getItem('textoItem');
cartItems.innerHTML = saveLocalStorage;

const totalCartStorage = localStorage.getItem('totalcarrinho');
total.innerHTML = totalCartStorage;

// Este Requisito 4, foi feito com a ajuda do David Gonzaga

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // desestruturação do objeto para acessar as 3 propriedades
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku)); //  tipo:span classe:item conteudo:sku
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }

  function cartItemClickListener(event) { // Requisito 3 - remover item do carrinho
    cartItems.removeChild(event.target); 
    const textItem = cartItems.innerHTML;
    const valueShop = event.target.innerText.split('|');
    const numberPrice = parseFloat(valueShop[2].split('$')[1]);
    sum -= numberPrice;
    total.innerText = sum;
    localStorage.setItem('textoItem', textItem);
    localStorage.setItem('totalcarrinho', sum);
  }
  
  Array.from(itemsCart).forEach((li) => { // Requisito 4
    li.addEventListener('click', cartItemClickListener);
  });

  function createCartItemElement({ id: sku, title: name, price: salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    sum += salePrice;
    total.innerText = sum;
    localStorage.setItem('totalcarrinho', sum);
    return li;
  }
  
  const callApiItemsByID = (id) => { // Requisito 2
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => {
      const itemByID = createCartItemElement(data);
    cartItems.appendChild(itemByID);
    const textItem = cartItems.innerHTML;
    localStorage.setItem('textoItem', textItem);
  });
};

const AddItemOnCart = () => { // Requisito 2
  const getButtonOfItem = document.querySelectorAll('.item__add'); // retorna HTML Colection
  getButtonOfItem.forEach((element) => {
    element.addEventListener('click', (event) => {
      const getItemByID = event.target.parentElement.firstChild.innerText; // Para fazer essa linha, eu olhei o código do Henrique Alarcon.
      callApiItemsByID(getItemByID); // Pois eu não estava conseguindo acessar o ID do primeiro elemento chamado no click.
    });
  });
};

const renderProduct = () => { //  Requisito 1 - feito
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => {
    items.innerHTML = '';
    data.results.forEach((element) => {
      items.appendChild(createProductItemElement(element));
    });
  })
  .then(() => AddItemOnCart());
};

function clear() {
  cartItems.innerText = '';
  total.innerText = 0;
  localStorage.clear();
}

buttonClear.addEventListener('click', clear);

window.onload = function onload() { renderProduct(); AddItemOnCart(); };