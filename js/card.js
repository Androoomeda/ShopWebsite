export function createCard(product, onLikeToggle, isLiked = false) {
  const card = document.createElement('article');
  card.className = 'card';

  const ref = document.createElement('a');
  ref.href = `itemPage.html?id=${product.id}`;

  const img = document.createElement('img');
  img.src = "http://localhost:5120" + product.imagePath;
  img.alt = product.name;

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const title = document.createElement('h2');
  title.className = 'card-title';
  title.textContent = product.name;

  const cardBottom = document.createElement('div');
  cardBottom.className = 'card-bottom';

  const price = document.createElement('p');
  price.className = 'card-price';
  
  if (product.discountPrice) {
    price.innerHTML = `${product.discountPrice}$ <del class="product-discount">${product.price}$</del>`;
  }
  else {
    price.textContent = `${product.price}$`;
  }

  const cardBottomRight = document.createElement('div');
  cardBottomRight.className = 'card-bottom-right';

  let liked = isLiked;

  const likeImg = document.createElement('img');
  likeImg.className = 'likeButton';
  likeImg.src = liked ? 'sources/addedfavorite.svg' : 'sources/favorite.svg';

  likeImg.addEventListener('click', () => {
    liked = !liked;
    likeImg.src = liked ? 'sources/addedfavorite.svg' : 'sources/favorite.svg';
    onLikeToggle(liked, product.id);
  });

  cardBottomRight.appendChild(likeImg);

  cardBottom.appendChild(price);
  cardBottom.appendChild(cardBottomRight);

  cardBody.appendChild(title);
  cardBody.appendChild(cardBottom);

  ref.appendChild(img);

  card.appendChild(ref);
  card.appendChild(cardBody);

  return card;
}