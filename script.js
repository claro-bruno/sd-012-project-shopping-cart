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

// function createProductItemElement({ id: sku, id: name, id: image }) /* ({}) desestruturando um objeto ?*/{
//   const section = document.createElement('section');
//   section.className = 'item';
//   const product = document.querySelector('.items'); /* buscar a section contendo a class.item */

//   section.appendChild(createCustomElement('span', 'item__sku', sku));
//   section.appendChild(createCustomElement('span', 'item__title', name));
//   section.appendChild(createProductImageElement(image));
//   section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

//   product.appendChild(section); /* meu product vai receber um filho chamado section, puxando o arquivo.
//  */ 
// /*   não precisa do return pois o product.appendChild(section); já está retornando */
// }

function createProductItemElement({
  id: sku,
  id: name,
  id: image,
}) {
  const section = document.createElement('section');
  section.className = 'item';
  const product = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  product.appendChild(section);
}

// async function getItem() { /* async faz a mesma coisa da Promise, fica mais fácil de interpretar */
//   let response /* response um objeto que recebe a propriedade Json(), que recebe uma promessa q seja retornado um fetch (API) */= await /* await esperando uma promessa, a chamada do fetch, mas somente a propriedade do Json */ fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador') /* toda a API está contida no response, mas só queremos pegar o JASON */
//   let itemData = await /* await esperando o response.json */response.json(); /* .json é uma function */
//   return itemData.results.forEach((itemML) => createProductItemElement(itemML)); /* itemML não sabemos qual parametro está passando, qual valor vai ser recebido */
// } /* forEach vai passar por cada item para pegar o produto, criando o produto */ 

async function getItem() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const itemData = await response.json();
  return itemData;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
}

// async function fecthAddItem(id) {
//   const response = await fetch(´https://api.mercadolibre.com/items/${id}´);
//   const itemData = await response.json();
//   return itemData.results.forEach((itemML) => createProductItemElement(itemML));
// } 

async function fecthAddItem(id) {
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const result = await response.json();
    return result;
  }

function createCartItemElement({
  id: sku,
  title: name,
  price: salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const localStorageList = document.querySelector('ol');

const saveLocalStorage = () => {
  const saveList = document.querySelector('.cart__items');
  localStorage.setItem('listSave', saveList.innerHTML);
};

const getLocalStorage = () => {
  const itemGet = localStorage.getItem('listSave');
  localStorageList.innerHTML = itemGet;
};

function cartItem() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const id = event.target.parentElement.firstChild.innerHTML;
      const itemSelected = await fecthAddItem(id);
      const ol = document.querySelector('.cart__items');
      ol.appendChild((createCartItemElement(itemSelected)));
      saveLocalStorage();
    });
  });
}

window.onload = async () => {
  const addItem = await getItem();
  addItem.results.forEach((itemML) => createProductItemElement(itemML));
  cartItem();
  getLocalStorage();
};

// OK!