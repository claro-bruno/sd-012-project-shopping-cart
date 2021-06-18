async function pegarItem() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const itemData = await response.json();
  return itemData;
  // .results.forEach((itemML) => createProductItemElement(itemML));
}
// function pegarItem() {
//   return new Promise((resolve, reject) => {
//     fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
//       .then((response) => response.json())
//       .then((array) => resolve(array))
//       .catch((error) => reject(error));
//   });
// }

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
  const product = document.querySelector('.items');
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  product.appendChild(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
function cartItemClickListener(event) {
  event.target.remove();
  let total = 0;
  const totalItem = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');
  totalItem.forEach((element) => {
    const price = -element.innerText.split('$')[1];
    total -= price;
  });
  totalPrice.innerText = total;
}

function fetchAddItem(id) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((array) => resolve(array))
      .catch((error) => reject(error));
  });
}

// async function testeGabriela1(id){
//   let response = await fetch(`https://api.mercadolibre.com/items/${id}`);
//   let itemData = await response.json();
//   return itemData.results.forEach((itemML) => createProductItemElement(itemML));
// }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const localStorageList = document.querySelector('ol');

const saveLocalStorage = () => {
  const salvaLista = document.querySelector('.cart__items');
  localStorage.setItem('listaSalva', salvaLista.innerHTML);
};

// Essa função eu verifiquei no slack através da dúvida da Marcela, e depois pelo seu gitHub que foi deixado na thread https://trybecourse.slack.com/archives/C01T2C18DSM/p1623351073321900
const getLocalStorage = () => {
  const pegaItemLS = localStorage.getItem('listaSalva');
  localStorageList.innerHTML = pegaItemLS;
};

// Esse requisito eu fiz com as duvidas resolvidas no slack através da tread da marcela no requisito 4 direcionando ao gitHub https://trybecourse.slack.com/archives/C01T2C18DSM/p1623351073321900
const verificaValor = () => {
  let total = 0;
  const totalItem = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');
  totalItem.forEach((element) => {
    const price = +element.innerText.split('$')[1];
    total += price;
  });
  totalPrice.innerText = total;
};

function addItem() {
  const botao = document.querySelectorAll('.item__add');
  botao.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const id = event.target.parentElement.firstChild.innerHTML;
      const itemSelected = await fetchAddItem(id);
      const ol = document.querySelector('.cart__items');
      ol.appendChild(createCartItemElement(itemSelected));
      saveLocalStorage();
      verificaValor();
    });
  });
}

const removeAll = () => {
  const buttonRemoveAll = document.querySelector('.empty-cart');
  buttonRemoveAll.addEventListener('click', () => {
    const li = document.querySelectorAll('li');
    for (let index = 0; index < li.length; index += 1) {
      li[index].remove();
    }
  });
};

window.onload = async () => {
    // const item = await pegarItem();
    // item.results.forEach((itemML) => createProductItemElement(itemML));
    // addItem();
   const item = await pegarItem();
   item.results.forEach((itemML) => createProductItemElement(itemML));
   addItem();
   getLocalStorage();
   removeAll();
};
