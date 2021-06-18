// const filhosItems = document.querySelector('.items');
const carrinhoDosItems = document.querySelector('ol');

async function fet() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  return data;
}

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
  const createSection = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  createSection.appendChild(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// const fet = () => {
//   fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
//   .then((response) => response.json())
//   .then((data) => {
//     data.results.forEach((element) => {
//       createProductItemElement(element);
//       filhosItems.appendChild(createProductItemElement(element));
//     });
//   });
// };

function fetItemId(id) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((error) => reject(error));
  });
  }

  const localStorageList = () => {
    localStorage.setItem('listItems', carrinhoDosItems.innerHTML);
  };
  
const buttonAdd = () => {
  const buttonAddCart = document.querySelectorAll('.item__add');
  buttonAddCart.forEach((element) => {
    element.addEventListener('click', async (event) => {
      const itemID = event.target.parentElement.firstChild.innerHTML;
      const getFetId = await fetItemId(itemID);
      carrinhoDosItems.appendChild(createCartItemElement(getFetId));
      localStorageList();
    });
  });
};

const getLocalStorageList = () => {
  const getItemList = localStorage.getItem('listItems');
  carrinhoDosItems.innerHTML = getItemList;
};

window.onload = async () => { 
  const receiveItems = await fet();
  receiveItems.results.forEach((element) => createProductItemElement(element));
  buttonAdd();
  getLocalStorageList();
};