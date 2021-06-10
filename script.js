let sum = 0;

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function elementoLoading() {
  const load = document.createElement('section');
  load.className = 'loading';
  load.innerText = 'loading...';
  document.querySelector('body').appendChild(load);
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
  const caminho = document.querySelector('.total-price');
  const liDividida = event.target.innerHTML.split('$');
  const preçoC = parseFloat(liDividida[1]).toFixed(2);
  sum -= preçoC;
  caminho.innerText = sum;

  event.target.remove();
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function listagemItems() {
  const apiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  elementoLoading();
  const listagemPc = fetch(apiMercadoLivre)
  .then((result) => result.json())
  .then((data) => data.results.forEach((elemento) => {
    const item = createProductItemElement(elemento.id, elemento.title, elemento.thumbnail);
    document.querySelector('.items').appendChild(item);
  }));
  
  return listagemPc;
}

function soma(preço) {
  sum += preço;
  return sum;
}

function attachButtonsEvents() {
  const itensAdds = document.querySelectorAll('.item__add');
  for (let index = 0; index < itensAdds.length; index += 1) {
    itensAdds[index].addEventListener('click', function () {
      const selectedID = document.querySelectorAll('.item__sku')[index].textContent;
      fetch(`https://api.mercadolibre.com/items/${selectedID}`)
      .then((pc) => pc.json())
      .then((objPc) => {
        const liCarrinho = createCartItemElement(objPc.id, objPc.title, objPc.price);
        document.querySelector('.cart__items').appendChild(liCarrinho);
        const a = soma(objPc.price);
        document.querySelector('.total-price').innerText = a;
      });
    });
  }
}

const itemsCarrinho = document.querySelectorAll('.cart__item');

function apagaClicado() {
  for (let i = 0; i < itemsCarrinho.length; i += 1) {
    itemsCarrinho[i].addEventListener('click', cartItemClickListener);
  }
}

function apagaTodos() {
  const caminho = document.getElementById('priceT');
  const butaoEsvaziar = document.querySelector('.empty-cart');
  butaoEsvaziar.addEventListener('click', () => {
  caminho.innerText = null;
  sum = 0;
  while (document.querySelectorAll('.cart__item').length > 0) {
    document.getElementsByClassName('cart__item')[0].remove();
  }
  });
}

function removeElementoLoading() {
  document.querySelector('.loading').remove();
}

window.onload = function onload() { 
  listagemItems().then(() => {
    attachButtonsEvents();
    removeElementoLoading();
  });
  apagaClicado();
  apagaTodos();
};