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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getItem(item) {
  return new Promise((resolve, reject) => {
    if (item === 'computador') {
      fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
        .then((res) => res.json())
        .then((json) => {
          json.results.forEach((curr, index) => {
            const { id: sku, title: name, thumbnail: image } = curr;
            const itemSection = document.querySelector('.items');
            itemSection.appendChild(
              createProductItemElement({ sku, name, image })
            );
          });
        });
    } else {
      reject;
    }
  });
}

window.onload = function onload() {
  getItem('computador');
};
