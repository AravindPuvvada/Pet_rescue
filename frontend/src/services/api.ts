// const API_BASE_URL = 'http://localhost:8000/api';

// class ApiService {
//   private getAuthHeaders() {
//     const token = localStorage.getItem('access_token');
//     return {
//       'Content-Type': 'application/json',
//       ...(token && { 'Authorization': `Bearer ${token}` })
//     };
//   }

//   private async handleResponse(response: Response) {
//     if (!response.ok) {
//       const error = await response.json().catch(() => ({ message: 'Network error' }));
//       throw new Error(error.message || `HTTP ${response.status}`);
//     }
//     return response.json();
//   }

//   async request(endpoint: string, options: RequestInit = {}) {
//     const url = `${API_BASE_URL}${endpoint}`;
//     const response = await fetch(url, {
//       ...options,
//       headers: {
//         ...this.getAuthHeaders(),
//         ...options.headers,
//       },
//     });
//     return this.handleResponse(response);
//   }

//   // Auth endpoints
//   async login(email: string, password: string) {
//     const response = await this.request('/auth/login/', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     });
    
//     if (response.tokens) {
//       localStorage.setItem('access_token', response.tokens.access);
//       localStorage.setItem('refresh_token', response.tokens.refresh);
//     }
    
//     return response;
//   }

//   async register(userData: {
//     first_name: string;
//     last_name: string;
//     email: string;
//     username: string;
//     password: string;
//   }) {
//     const response = await this.request('/auth/register/', {
//       method: 'POST',
//       body: JSON.stringify({ ...userData, password_confirm: userData.password }),
//     });
    
//     if (response.tokens) {
//       localStorage.setItem('access_token', response.tokens.access);
//       localStorage.setItem('refresh_token', response.tokens.refresh);
//     }
    
//     return response;
//   }

//   logout() {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//   }

//   // Pet endpoints
//   async getPets(filters?: { status?: string; type?: string; search?: string }) {
//     const params = new URLSearchParams();
//     if (filters?.status) params.append('status', filters.status);
//     if (filters?.type) params.append('type', filters.type);
//     if (filters?.search) params.append('search', filters.search);
    
//     const queryString = params.toString();
//     return this.request(`/pets/${queryString ? `?${queryString}` : ''}`);
//   }

//   async getPet(id: number) {
//     return this.request(`/pets/${id}/`);
//   }

//   async createPet(petData: any) {
//     return this.request('/pets/', {
//       method: 'POST',
//       body: JSON.stringify(petData),
//     });
//   }

//   async updatePet(id: number, petData: any) {
//     return this.request(`/pets/${id}/`, {
//       method: 'PUT',
//       body: JSON.stringify(petData),
//     });
//   }

//   async deletePet(id: number) {
//     return this.request(`/pets/${id}/`, {
//       method: 'DELETE',
//     });
//   }

//   async getMyPets() {
//     return this.request('/pets/my_pets/');
//   }

//   async getPetStats() {
//     return this.request('/pets/stats/');
//   }

//   // User endpoints
//   async getUsers() {
//     return this.request('/users/');
//   }

//   async getUser(id: number) {
//     return this.request(`/users/${id}/`);
//   }

//   async updateUser(id: number, userData: any) {
//     return this.request(`/users/${id}/`, {
//       method: 'PUT',
//       body: JSON.stringify(userData),
//     });
//   }

//   isAuthenticated() {
//     return !!localStorage.getItem('access_token');
//   }
// }

// export const apiService = new ApiService();