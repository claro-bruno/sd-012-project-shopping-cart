const array = [];
const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const cartItems = document.querySelector('.cart__items');
const itemsSection = document.querySelector('.items');

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

// function storage() {
//   localStorage.setItem('itemStorage', cartItems.innerHTML);
// }

function itemGet() {
  const itemStorage = localStorage.getItem('itemStorage');
  if (itemStorage) {
    cartItems.innerHTML = itemStorage;
  }
}

const newFunction = (valor) => {
  array.push(valor);
  const storageString = JSON.stringify(array);
  localStorage.setItem('iten', storageString);
};

const removeItemLs = (itenLi) => {
  // const arrayStorage = JSON.stringify(array);
  // localStorage.setItem('iten', arrayStorage);
  const arrayStorage = JSON.parse(localStorage.getItem('iten'));
  const itemId = itenLi.innerText.slice(5, 18);
  const itemRem = arrayStorage.find((element) => element.slice(35) === itemId);
  arrayStorage.splice(arrayStorage.indexOf(itemRem, 0));
  localStorage.setItem('iten', arrayStorage);
};

// function removeItens() {
//   localStorage.removeItem('itemStorage');
// }

function cartItemClickListener(event) {
  const cartItem = document.querySelector('.cart__item');
  cartItem.parentNode.removeChild(event.target);
  removeItemLs(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function clearCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    cartItems.innerHTML = ' ';
   // removeItens();
  });
}

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }

  function total(price) {
    const totalPrice = document.querySelector('.total-price');
    totalPrice.innerText = parseFloat(totalPrice.innerText) + price;
  }
  
  function fetchButton() {
    // const items = document.querySelectorAll('.item');
    const buttons = document.querySelectorAll('.item__add');
    buttons.forEach((button) => button.addEventListener('click', () => {
      const id = button.parentNode.firstChild.innerText;
      const url2 = `https://api.mercadolibre.com/items/${id}`;
      fetch(url2)
      .then((response) => response.json())
      .then((objeto) => {
        const ol = document.querySelector('.cart__items');
        ol.appendChild(createCartItemElement(objeto));
        newFunction(url2);
      //  storage();
        total(objeto.price);
      });
    }));
  }
  
  function fetchProduct() {
    const loading = document.querySelector('.loading');
    fetch(url)
    .then((response) => response.json())
    .then((objeto) => objeto.results.forEach((element) => {
      itemsSection.appendChild(createProductItemElement(element));
    }))
    .then(() => 
    loading.remove())
    .then(() => fetchButton());
  }
  
  window.onload = function onload() { 
    fetchProduct();
    itemGet();
    clearCart();
  };