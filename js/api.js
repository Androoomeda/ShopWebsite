export async function fetchProducts() {
  const response = await fetch('http://localhost:5120/api/Products')

  if (!response.ok) throw new Error('Ошибка сети');

  return response.json();
}

export async function fetchCategoryProducts(categoryName) {
  const response = await fetch(`http://localhost:5120/api/Categories/${categoryName}`)

  if (!response.ok) throw new Error('Ошибка сети');

   return response.json();
}

export async function fetchCategoryById(productId){
  const response = await fetch(`http://localhost:5120/api/Products/${productId}`)

  if (!response.ok) throw new Error(`Ошибка загрузки продукта c id=${productId}: 
    ${response.statusText}`);

  return response.json();
}