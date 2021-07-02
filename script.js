let total = 0;

function updateLocalStorage() {
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
  localStorage.setItem('total', total);
}

function loadLocalStorage() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  document.querySelector('.total-price').innerHTML = localStorage.getItem('total');
}

function setTotal() {
  document.querySelector('.total-price').innerHTML = total;
  updateLocalStorage();
}

function loading() {
  const section = document.createElement('section');
  section.innerHTML = 'Loading...';
  section.className = 'loading';
  document.querySelector('.items').appendChild(section);
}

function removeLoading() {
  document.querySelector('.loading').remove();
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

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  total -= Number(event.target.id) / 2;
  event.target.remove();
  setTotal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = `${salePrice}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  total += salePrice;
  setTotal();
  return li;
}

function fetchAPI(item) {
  loading();
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${item}`;
  fetch(url)
    .then((response) => {
      response.json().then((itemList) => {
      removeLoading();
      itemList.results.forEach((items) => {
        const section = document.querySelector('.items');
        section.appendChild(createProductItemElement(items));
      });
    });
  });
}

function addToCart(id) {
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
    .then((response) => {
      response.json().then((itemList) => {
      const section = document.getElementsByClassName('cart__items')[0];
      section.appendChild(createCartItemElement(itemList));
      updateLocalStorage();
    }); 
  });
}

document.addEventListener('click', (event) => {
  if (event.target.className === 'item__add') {
    addToCart(getSkuFromProductItem(event.target.parentElement));
  }
  if (event.target.className === 'cart__item') {
    cartItemClickListener(event);
  }
  if (event.target.className === 'empty-cart') {
    document.getElementsByClassName('cart__items')[0].innerHTML = '';
    total = 0;
    setTotal();
    updateLocalStorage();
  }
});

window.onload = function onload() {
  fetchAPI('computador');
  loadLocalStorage();
};

// let total = 0;

// const updateLocalStorage = () => {
//   localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
//   localStorage.setItem('total', total);
// };

// const loadLocalStorage = () => {
//   document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
//   document.querySelector('.total-price').innerHTML = localStorage.getItem('total');
// };

// const updateTotal = () => {
//   document.querySelector('.total-price').innerHTML = total;
//   updateLocalStorage();
// };

// const insertLoading = () => {
//   const section = document.createElement('section');
//   section.innerHTML = 'Loading...';
//   section.className = 'loading';
//   document.querySelector('.items').appendChild(section);
// };

// const removeLoading = () => {
//   document.querySelector('.loading').remove();
// };

// function createProductImageElement(imageSource) {
//   const img = document.createElement('img');
//   img.className = 'item__image';
//   img.src = imageSource;
//   return img;
// }
// function createCustomElement(element, className, innerText) {
//   const e = document.createElement(element);
//   e.className = className;
//   e.innerText = innerText;
//   return e;
// }

// function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
//   const section = document.createElement('section');
//   section.className = 'item';

//   section.appendChild(createCustomElement('span', 'item__sku', sku));
//   section.appendChild(createCustomElement('span', 'item__title', name));
//   section.appendChild(createProductImageElement(image));
//   section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

//   return section;
// }

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
//   total -= Number(event.target.id) / 2;
//   event.target.remove();
//   updateTotal();
// }

// function createCartItemElement({ id: sku, title: name, price: salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.id = `${salePrice}`;
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   total += salePrice;
//   updateTotal();
//   return li;
// }

// const createItemsList = (searchTerm) => {
//   insertLoading();
//   fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`).then((response) => {
//     response.json().then((itemList) => {
//       removeLoading();
//       itemList.results.forEach((specificItem) => {
//         const itemsSection = document.querySelector('.items');
//         itemsSection.appendChild(createProductItemElement(specificItem));
//       });
//     });
//   });
// };

// const fetchItemPrice = (sku) => {
//   fetch(`https://api.mercadolibre.com/items/${sku}`).then((response) => {
//     response.json().then((item) => {
//       const cartSection = document.getElementsByClassName('cart__items')[0];
//       cartSection.appendChild(createCartItemElement(item));
//       updateLocalStorage();
//     });
//   });
// };

// document.addEventListener('click', (event) => {
//   if (event.target.className === 'item__add') {
//     fetchItemPrice(getSkuFromProductItem(event.target.parentElement));
//   }
//   if (event.target.className === 'cart__item') {
//     cartItemClickListener(event);
//   }
//   if (event.target.className === 'empty-cart') {
//     document.getElementsByClassName('cart__items')[0].innerHTML = '';
//     total = 0;
//     updateTotal();
//     updateLocalStorage();
//   }
// });

// window.onload = function onload() {
//   createItemsList('computador');
//   loadLocalStorage();
// };
