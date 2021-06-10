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
  // id, title, thumbnail
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  const itemsSection = document.querySelector('.items');
  itemsSection.appendChild(section);

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

async function fetchProductArrayFromURL(URL, product) {
  const response = await fetch(`${URL}${product}`);
  const json = await response.json();
  return json;
}

function cartItemClickListener(event) {
  const shoppingCartList = document.getElementById('cart');
  shoppingCartList.removeChild(event.target);
  localStorage.setItem('shoppingCartList', shoppingCartList.innerHTML);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const resultsClickListener = (results) => {
  const shoppingCartList = document.getElementById('cart');
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button, index) => {
    button.addEventListener('click', async () => {
      const json = await fetchProductArrayFromURL(
        'https://api.mercadolibre.com/items/',
        results[index].id,
      );
      shoppingCartList.appendChild(createCartItemElement(json));
      localStorage.setItem('shoppingCartList', shoppingCartList.innerHTML);
    });
  });
};

window.onload = async function onload() {
  const shoppingCartList = document.getElementById('cart');
  const saved = localStorage.getItem('shoppingCartList');
  if (saved) {
    shoppingCartList.innerHTML = saved;
    const savedCartListItems = document.querySelectorAll('.cart__item');
    savedCartListItems.forEach((savedCartListItem) => {
      savedCartListItem.addEventListener('click', cartItemClickListener);
    });
  }
  const { results } = await fetchProductArrayFromURL(
    'https://api.mercadolibre.com/sites/MLB/search?q=',
    'computador',
  );
  results.forEach((result) => {
    createProductItemElement(result);
  });
  resultsClickListener(results);
};
/* 

promise: obrigatoriamente tem que chamar resolve() e reject(), senão fica pending pra sempre em loop

devem ser chamados no retorno de uma promise
.then((result) => {})
.catch((error) => {})

async/await
precisa de try catch

debbugar o fetch

const e await
e try catch para erro

const fulano = await getGithubUser();
fulano é o próprio response
fulano.json retorna uma promise

TODA VEZ QUE SE RETORNAR UMA PROMISE ASSINCRONA, TENHO QUE RESOLVER (SINCRONIZAR) COM .THEN OU ASYNC AWAIT

englobar retorno da fetch em uma nova promise

 */
