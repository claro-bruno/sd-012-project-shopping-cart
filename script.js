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

function createProductItemElement(sku, name, image) {
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
  // coloque seu código aqui
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function adicionaAoCar() {
    const botoes = document.querySelector('.items');
      botoes.addEventListener('click', function (event) {
        if (event.target.innerText === 'Adicionar ao carrinho!') {
          const itemCar = event.target.previousSibling.previousSibling.previousSibling.innerText;
          fetch(`https://api.mercadolibre.com/items/${itemCar}`)
            .then((saida1) => saida1.json())
            .then((saida) => {
              const criaItemCarrinho = createCartItemElement(saida.id, saida.title, saida.price);
              document.querySelector('.cart__items').appendChild(criaItemCarrinho);
            });
        }
      });
  }

window.onload = function onload() {
  function selecionaResults() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';  
  fetch(url)
    .then((saida1) => saida1.json())
    .then((saida) => {
      saida.results.forEach((elemento) => {
        const criaItem = createProductItemElement(elemento.id, elemento.title, elemento.thumbnail);
        document.querySelector('.items').appendChild(criaItem);
      });
      })
    .then(() => adicionaAoCar());
}
selecionaResults();
};