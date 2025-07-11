export async function getProducts() {
  const response = await fetch('http://localhost:5120/api/products')

  if (!response.ok) throw new Error(`Ошибка загрузки продуктов: 
    ${response.statusText}`);

  return response.json();
}

export async function getCategoryProducts(categoryName) {
  const response = await fetch(`http://localhost:5120/api/categories/${categoryName}`)

  if (!response.ok) throw new Error(`Ошибка загрузки продуктов: 
    ${response.statusText}`);

  return response.json();
}

export async function getProductById(productId) {
  const response = await fetch(`http://localhost:5120/api/products/${productId}`)

  if (!response.ok) throw new Error(`Ошибка загрузки продукта c id=${productId}: 
    ${response.statusText}`);

  return response.json();
}

export async function getFavoriteIds() {
  const response = await fetch(`http://localhost:5120/api/favorite/get-ids`,
    {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

  if (!response.ok) throw new Error(`Ошибка загрузки избранных продуктов: 
    ${response.statusText}`);

  return response.json();
}

export async function getFavoriteProducts() {
  const response = await fetch(`http://localhost:5120/api/favorite`,
    {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

  return handleApiResponse(response);
}


export async function addToFavorite(productId) {
  const response = await fetch(`http://localhost:5120/api/favorite/${productId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

  return handleApiResponse(response);
}

export async function removeFavorite(productId) {
  const response = await fetch(`http://localhost:5120/api/favorite/${productId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

  return handleApiResponse(response);
}

export async function getCartItems(){
  const response = await fetch(`http://localhost:5120/api/cartitem`,
  {
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });

  return handleApiResponse(response);
}

export async function addToCart(productId, sizeId){
  const data = {
    productId: productId,
    sizeId: sizeId
  };

  const response = await fetch(`http://localhost:5120/api/cartitem/addtocart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  return handleApiResponse(response);
}

export async function editCartItem(productId, quantity){
  const data = { quantity: quantity };

  const response = await fetch(`http://localhost:5120/api/cartitem/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  return handleApiResponse(response);
}

export async function removeCartItem(productId){
   const response = await fetch(`http://localhost:5120/api/cartitem/${productId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

  return handleApiResponse(response);
}

async function handleApiResponse(response) {
  if (response.status === 401) {
    window.location.hre = 'auth.html';
    return Promise.reject(new Error('Unauthorized'));
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ошибка: ${response.status} ${errorText}`);
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return null;
  }
}