const baseUrl = 'http://localhost:5120';

export const getProducts = () => apiRequest('/api/products');

export const getCategoryProducts = categoryName =>
  apiRequest(`/api/categories/${categoryName}`);

export const getProductById = productId =>
  apiRequest(`/api/products/${productId}`, { credentials: 'include' });

export const getFavoriteIds = () =>
  apiRequest(`/api/favorite/get-ids`, { credentials: 'include' });

export const getFavoriteProducts = () =>
  apiRequest(`/api/favorite`, { credentials: 'include', redirectOn401: true });

export const addToFavorite = productId =>
  apiRequest(`/api/favorite/${productId}`, { method: 'POST', credentials: 'include', redirectOn401: true });

export const removeFavorite = productId =>
  apiRequest(`/api/favorite/${productId}`, { method: 'DELETE', credentials: 'include', redirectOn401: true });

export const getCartItems = () =>
  apiRequest(`/api/cartitem`, { credentials: 'include', redirectOn401: true });

export async function addToCart(productId, sizeId) {
  const data = {
    productId: productId,
    sizeId: sizeId
  };

  return await apiRequest(`/api/cartitem/addtocart`,
    { method: 'POST', credentials: 'include', body: data, redirectOn401: true });
}

export async function editCartItem(productId, quantity) {
  const data = { quantity: quantity };

  return await apiRequest(`/api/cartitem/${productId}`,
    { method: 'PUT', credentials: 'include', body: data, redirectOn401: true });
}

export const removeCartItem = productId =>
  apiRequest(`/api/cartitem/${productId}`,
    { method: 'DELETE', credentials: 'include', redirectOn401: true });

export const logoutUser = () =>
  apiRequest(`/api/shopuser/logout`,
    { method: 'POST', credentials: 'include' });

export const loginUser = data =>
  apiRequest('/api/ShopUser/login',
    { method: 'POST', credentials: 'include', body: data });

export const registerUser = data =>
  apiRequest('/api/ShopUser/register',
    { method: 'POST', credentials: 'include', body: data });

export const getUserInfo = () =>
  apiRequest('/api/shopuser', { credentials: 'include' });

async function apiRequest(path, { method = 'GET', body, credentials, redirectOn401 = false } = {}) {
  const url = baseUrl + path;

  const fetchOptions = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials
  };

  if (body)
    fetchOptions.body = JSON.stringify(body);

  const response = await fetch(url, fetchOptions);
  return handleApiResponse(response, { redirectOn401 });
}

async function handleApiResponse(response, { redirectOn401 = false } = {}) {
  const contentType = response.headers.get('Content-Type');
  let json = null;

  if (contentType && contentType.includes('application/json')) {
    try {
      json = await response.json();
    } catch { }
  }

  if (response.status === 401) {
    if (redirectOn401) {
      window.location.href = 'auth.html';
    }

    return { success: false, status: 401, unauthorized: true, error: json };
  }

  if (!response.ok) {
    return { success: false, status: response.status, error: json ?? await response.text() };
  }

  return { success: true, data: json };
}