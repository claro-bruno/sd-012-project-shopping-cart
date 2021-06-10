const urlAPI = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

const fetchAPI = (products) => {
  const getItem = document.querySelector('.items');
  products.forEach((product) => getItem.appendChild(createProductItemElement(product)));
};

// function getSkuFromProductItem(item) {
//     return item.querySelector('span.item__sku').innerText;
//   }

function cartItemClickListener(event) {
  if (event.target.classList.value === 'cart__item') {
    event.target.remove();
  } 
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const cartItem = document.querySelector('.cart__items');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  cartItem.appendChild(li);
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
        .then((data) => createCartItemElement(data));
    });
  });
};

window.onload = function onload() { 
  fetch(urlAPI)
  .then((response) => response.json())
  .then((data) => fetchAPI(data.results))
  .then(() => addInCart());
};