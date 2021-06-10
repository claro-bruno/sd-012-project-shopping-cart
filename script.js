let soma = 0;
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

function cartItemClickListener(evento) {
   if (evento.target.className === 'cart__item') {
    evento.target.remove();
    soma -= parseFloat(evento.target.innerText.split('$')[1]);
    document.getElementById('total-price').innerText = soma;
  } 
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
              soma += saida.price;
              const valorFinal = document.querySelector('.total-price');
              valorFinal.innerText = soma;
            });
        }
      });
}
function criaLoading() {
  const carregamento = document.createElement('section');
  carregamento.className = 'loading';
  carregamento.innerText = 'loading...';
  document.querySelector('body').appendChild(carregamento);
}
function removeElementoLoading() {
  document.querySelector('.loading').remove();
}
function botaoLimpaCarrinho() {
  const botao = document.createElement('button');
  document.querySelector('.cart').appendChild(botao);
  botao.innerText = 'limpa carrinho';
  botao.className = 'empty-cart';
  botao.addEventListener('click', () => {
    soma = 0;
    document.querySelector('.total-price').innerText = soma;
    while (document.querySelectorAll('.cart__item').length > 0) {
    document.getElementsByClassName('cart__item')[0].remove();
  }
  });
}
window.onload = function onload() {
  function selecionaResults() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  criaLoading();
  fetch(url)
    .then((saida1) => saida1.json())
    .then((saida) => {
      saida.results.forEach((elemento) => {
        const criaItem = createProductItemElement(elemento.id, elemento.title, elemento.thumbnail);
        document.querySelector('.items').appendChild(criaItem);
      });
      removeElementoLoading();
      })
    .then(() => {
      adicionaAoCar();
      botaoLimpaCarrinho();
      cartItemClickListener();
    }); 
  } selecionaResults();
};