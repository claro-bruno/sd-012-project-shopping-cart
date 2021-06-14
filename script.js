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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getItem(id) {
  const cart = document.querySelector('.cart__items');
  try {
    await fetch(`https://api.mercadolibre.com/items/${id}`).then((response) => {
      response.json().then((product) => {
        cart.appendChild(createCartItemElement(product));
      });
    });
  } catch (error) {
    console.log(error);
  }
 }

//  const addButtonListeners = (() => {
//   const items = document.querySelectorAll('.item');
//   items.forEach((item) => {
//     const newItemId = item.querySelector('.id').textContent;
//     const newItemButton = item.querySelector('.item__add');
//     newItemButton.addEventListener('click', getItem(newItemId));
//   });
// });

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getProducts = ((searchTerm) => new Promise((resolve, reject) => {
  if (searchTerm === 'computador') {
    const items = document.querySelector('.items');
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`).then((response) => {
      response.json().then((products) => {
        products.results.forEach((product) => {
          items.appendChild(createProductItemElement(product))
          .querySelector('.item__add').addEventListener('click', () => (getItem(product.id)));
          // const newItemId = newItem.querySelector('.id').textContent;
          // const newItemButton = newItem.querySelector('.item__add');
          // newItemButton.addEventListener('click', getItem(newItemId));
        });
        resolve(products.results);
      });
    });
  } else {
    return reject(new Error('Produto não aceito!'));
  }
}));

const fetchProducts = async () => {
  try {
    await getProducts('computador'); // .forEach((product) => {
    //   document.querySelector('.items').appendChild(createProductItemElement(product)
    //   .querySelector('.item__add').addEventListener('click', getItem(product.id)));
    // });
  } catch (error) {
    console.log(error);
  }
};

window.onload = function onload() {
  fetchProducts();
  // addButtonListeners();
};
