const API_URL = "https://api.escuelajs.co/api/v1";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Ошибка запроса: ${response.status}`);
  }
  return response.json();
}

export const getProducts = (params, options = {}) => request(`/products?${params}`, options);
export const getProduct = (id, options = {}) => request(`/products/${id}`, options);
export const getCategories = () => request("/categories");
export const createProduct = (product) => request("/products/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(product),
});
export const updateProduct = (id, product) => request(`/products/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(product),
});
export const deleteProduct = (id) => request(`/products/${id}`, { method: "DELETE" });
