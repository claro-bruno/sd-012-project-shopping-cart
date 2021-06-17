const URL_BASE = 'https://api.mercadolibre.com/sites/MLB/search';
const cartItem = document.querySelector('.cart__items');

// const totalPrice = document.querySelector('.total-price');
// const fetchAPI = (url) => {
  //   return new Promise((resolve, reject) => {
    
    //     fetch(url)
    //       .then((response) => response.json())
    //       .then((data) => resolve(data.results))
    //       .catch((error) => reject(error));
    //   })
    // };
    
    // const getProducts = () => {
      //   const product =  
      
function cartTotalPrice() {
  // função feita com base na solução encontrada pelo David Azevedo: https://github.com/tryber/sd-012-project-shopping-cart/pull/120/files
  const totalPrice = document.querySelector('.total-price');
  const liCartItem = document.querySelectorAll('.cart__item');
  const childrenCartArr = Array.prototype.map.call(liCartItem, (li) => 
    Number(li.innerHTML.slice(li.innerHTML.indexOf('$') + 1)));
    const calcPrice = childrenCartArr.reduce((acc, curr) => acc + curr, 0);
    totalPrice.innerHTML = calcPrice;
}
// const totalPrice = document.querySelector('.total-price');
//   const liCartItem = document.querySelectorAll('.cart__item');
  
//   const cartItemArr = Array.prototype.map.call(liCartItem, (li) => {
//     Number(li.innerHTML.slice(li.innerHTML.indexOf('$') + 1));
//     const calcPrice = cartItemArr.reduce((acc, curr) => acc + curr, 0);
//     totalPrice.innerText = calcPrice;
//   });

// li.forEach((item) => {
// const num = Number.parseFloat(item.innerText.split('$')[1]);
// // const calcPrice = num.reduce((acc, curr) => acc + curr, 0);
// console.log(num);
// });
// totalPrice.innerHTML;
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

function saveLocalStage() {
  const liContent = cartItem.innerHTML.toString();
  localStorage.setItem('products', liContent);
}
function removeItemS(event) {
  event.addEventListener('click', event.remove());
  saveLocalStage();
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
//     return item.querySelector('span.item__sku').innerText;
//   }

function cartItemClickListener(event) {
  if (event.target.classList.value === 'cart__item') {
    event.target.remove();
  }
  cartTotalPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  cartItem.appendChild(li);
  saveLocalStage(); 
  cartTotalPrice();
  return li;
}

const addInCart = () => {
  const btnAdd = document.querySelectorAll('.item__add');

  btnAdd.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.parentNode.firstChild.innerText;
      const urlItem = `https://api.mercadolibre.com/items/${id}`;

      fetch(urlItem)
        .then((response) => response.json())
        .then((data) => createCartItemElement(data))
        .then(() => cartTotalPrice());
    });
  });
  cartTotalPrice();
};

const clearCart = () => {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    cartItem.innerText = '';
    saveLocalStage();
    cartTotalPrice();
  });
};

const fetchAPI = (search) => {
  const loading = document.querySelector('.loading');
  loading.innerHTML = 'loading...';

  fetch(`${URL_BASE}?q=${search}`)
  .then((response) => response.json())
  .then((data) => {
    data.results.forEach((result) => {
      const getItem = document.querySelector('.items');
      getItem.appendChild(createProductItemElement(result));
      loading.remove();
    });
    addInCart();
  });
};

window.onload = function onload() { 
  fetchAPI('computador');
  clearCart();
  const contentSave = localStorage.getItem('products');
  if (contentSave) {
    cartItem.innerHTML = contentSave;
    const getLi = document.querySelectorAll('.cart__item');
    getLi.forEach((item) => item.addEventListener('click', () => removeItemS(item)));
  }
};
