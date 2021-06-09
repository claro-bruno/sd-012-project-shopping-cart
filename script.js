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
  // coloque seu código aquii
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
  
  const listagemPc = fetch(apiMercadoLivre)
  .then((result) => result.json())
  .then((data) => data.results.forEach((elemento) => {
    const item = createProductItemElement(elemento.id, elemento.title, elemento.thumbnail);
    document.querySelector('.items').appendChild(item);
  }));
  
  return listagemPc;
}

setTimeout(function () {
  const itensAdds = document.querySelectorAll('.item__add');
  for (let index = 0; index < itensAdds.length; index += 1) {
    itensAdds[index].addEventListener('click', () => {
      const selectedID = document.querySelectorAll('.item__sku')[index].textContent;

      fetch(`https://api.mercadolibre.com/items/${selectedID}`)
      .then((pc) => pc.json())
      .then((objPc) => {
        const liCarrinho = createCartItemElement(objPc.id, objPc.title, objPc.price);
        document.querySelector('.cart__items').appendChild(liCarrinho);
      });
    });
  }
}, 1000);

window.onload = function onload() { listagemItems(); };