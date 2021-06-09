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

function cartItemClickListener(event) {
  // coloque seu código aqui
  console.log(event);
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

window.onload = function onload() {
  fetchApiML();
};
