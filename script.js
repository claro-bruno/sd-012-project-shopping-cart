const cartItemsClass = '.cart__items';

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

function createProductItemElement({ sku, name, image }) {
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

const saveCart = () => {
  const cartList = document.querySelector(cartItemsClass).innerHTML;
  localStorage.setItem('cartListItems', cartList);
};

const totalPrice = () => {
  let sum = 0;
  const cartItems = document.querySelectorAll('.cart__item');
  const totalPrices = document.querySelector('.total-price');
  if (cartItems.length === 0) totalPrices.innerText = 0;
  cartItems.forEach((current) => {
    sum += parseFloat(current.innerText.split('$')[1]);
    totalPrices.innerText = sum;  
  });
};

function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
  totalPrice();   
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => {
    cartItemClickListener(event);
  });
  return li;
}

//  pega botão para auxiliar na função addProductCart
const getButton = (button) => button.querySelector('button.item__add');

const addProductCart = () => {
  const items = document.querySelectorAll('.item');
  const itemsCart = document.querySelector(cartItemsClass);
  items.forEach((cartItem) => {
    const itemId = getSkuFromProductItem(cartItem);
    const btn = getButton(cartItem);
    btn.addEventListener('click', () => {      
      fetch(`https://api.mercadolibre.com/items/${itemId}`)
      .then((response) => response.json()).then((product) => {
        const { id: sku, title: name, price: salePrice } = product;
        return createCartItemElement({ sku, name, salePrice });
      })
      .then((li) => {
        itemsCart.appendChild(li);
        saveCart(); 
        totalPrice();       
      });         
    });
  });
};

function getItensApi() {  
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((products) => {
      products.results.forEach((product) => {
        const itensList = document.querySelector('.items');
        const parameters = { sku: product.id, name: product.title, image: product.thumbnail };
        return itensList.appendChild(createProductItemElement(parameters));
      });
    })
    .then(() => document.querySelector('.loading').remove())      
    .then(() => addProductCart())
    .catch((err) => console.log(`Algo deu Errado: ${err}`));  
}

const clearCart = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector(cartItemsClass).innerHTML = '';
    saveCart();
    totalPrice();
  });
};

const cartRemoveItems = document.querySelector(cartItemsClass);
cartRemoveItems.addEventListener('click', (event) => {
  cartItemClickListener(event);
});

window.onload = function onload() {  
  if (localStorage.cartListItems) {
    const cartList = document.querySelector(cartItemsClass);
    const loadCartList = localStorage.getItem('cartListItems');
    cartList.innerHTML = loadCartList;
  } 
  getItensApi();
  clearCart();
  totalPrice();
  };
