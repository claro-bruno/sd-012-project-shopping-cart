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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const saveLocal = () => {
  const xablau = document.querySelector('.buy');
  const storage = window.localStorage;
  storage.setItem('listaSalva', xablau.innerHTML);
};

function cartItemClickListener(event) {
  const quebra = (event.target.innerText).split('$');
  const value = document.getElementById('dept');
  let valor = value.innerText;
  valor -= quebra[1];
  value.innerText = valor;
  event.target.remove();
  saveLocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = (event) => {
  const father = event.target.parentNode;
  const serial = father.children[0].innerText;
  fetch(`https://api.mercadolibre.com/items/${serial}`)
  .then((idPromese) => idPromese.json())
  .then((id) => {
    const { id: sku, title: name, price: salePrice } = id;
    const ol = document.querySelector('.cart__items');
    ol.appendChild(createCartItemElement({ sku, name, salePrice }));
    let valor = parseFloat(document.getElementById('dept').innerText);
    valor += salePrice;
    document.getElementById('dept').innerText = valor;
    saveLocal();
  });
};

const fetchApiML = () => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => {
      result.json().then((list) => {
        const items = document.querySelector('.items');
        const { results } = list;
        for (let index = 0; index < results.length; index += 1) {
          const { id: sku, title: name, thumbnail: image } = results[index];
          items.appendChild(createProductItemElement({ sku, name, image }));
          const item = document.querySelectorAll('.item__add');
          item[index].addEventListener('click', addToCart);
        }
      });
    });
};

const testAndOpenSaved = () => {
  if (localStorage.getItem('listaSalva') !== 'undefined') {
    let valor = 0;
    const listaSalva = document.querySelector('.cart__items');
    const storage = window.localStorage;
    listaSalva.innerHTML = storage.getItem('listaSalva');
    const ol = document.getElementsByClassName('cart__item');
    for (let index = 0; index < ol.length; index += 1) {
      ol[index].addEventListener('click', (event) => cartItemClickListener(event));
      const quebra = (ol[index].innerText).split('$');
      valor += parseFloat(quebra[1]);
    }
    const value = document.getElementById('dept');
    value.innerText = valor;
  }
};

const cleanProduct = () => {
  const clear = document.querySelector('.empty-cart');
  clear.addEventListener('click', () => {
    document.querySelector('.buy').innerHTML = '';
    document.getElementById('dept').innerText = 0;
    saveLocal();
  })
};

window.onload = function onload() {
  fetchApiML();
  testAndOpenSaved();
  cleanProduct();
};
