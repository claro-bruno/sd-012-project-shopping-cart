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

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }
  
  function cartItemClickListener(event) {
      // coloque seu código aqui
      event.target.remove();
  }
    
    function createCartItemElement({ id: sku, title: name, price: salePrice }) {
        const li = document.createElement('li');
        li.className = 'cart__item';
        li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
        li.addEventListener('click', cartItemClickListener);
        return li;
      }
      
      const fetchComputadores = async () => {
        const catchItemsList = document.querySelector('.items');
        try {
          const respons = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
          const data = await respons.json();
          const dataResults = await data.results;
          return dataResults.forEach(({ id, title, thumbnail }) => {
            const item = createProductItemElement({ id, title, thumbnail });
            catchItemsList.appendChild(item);
          });
        } catch (error) {
          return error;
        }
      };

      const fetchItem = (aidi) => {
        const catchCart = document.querySelector('.cart__items');
      fetch(`https://api.mercadolibre.com/items/${aidi}`)
        .then((response) => response.json())
        .then(({ id, title, price }) => {
          catchCart.appendChild(createCartItemElement({ id, title, price }));
        });
      };
      
      const addClickCatchId = () => {
        const catchButtons = document.querySelectorAll('.item');
        catchButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
              const itemId = event.target.parentNode.firstChild.innerText;
              fetchItem(itemId);
            });
        });
      };

      window.onload = async function onload() {
        await fetchComputadores();
        await addClickCatchId();
        cartItemClickListener();
      };