// src/services/api.ts
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// ======================
// Interfaces
// ======================
export interface PetData {
  name: string;
  pet_type: string;
  breed: string;
  color: string;
  age?: number | null;   // 👈 allow null
  description: string;
  city: string;
  state: string;
}
export interface ProfileData {
  username: string;
  email: string;
  password?: string; // only needed on register
  gender?: string;
  phone?: string;
  address?: string;
  pincode?: string;
  profile_image?: string;
}

export interface PetReportData {
  title: string;
  description: string;
  location?: string;
  image?: string;
}

export interface AdoptionRequest {
  pet: number;
  message: string;
}

// ======================
// ApiService
// ======================
class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.detail || error.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });
    return this.handleResponse(response);
  }

  // ======================
  // Auth endpoints
  // ======================
  async login(email: string, password: string) {
    const response = await this.request('/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.access_token) {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
    }

    return response;
  }

  async register(userData: ProfileData) {
    return this.request('/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // ======================
  // Pet endpoints
  // ======================
  async getPets() {
    return this.request('/pets/');
  }

  async getPet(id: number) {
    return this.request(`/pets/${id}/`);
  }

  async createPet(petData: PetData) {
    return this.request('/pets/', {
      method: 'POST',
      body: JSON.stringify(petData),
    });
  }

  async createPetWithImage(petData: FormData) {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/pets/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: petData,
    });
    return this.handleResponse(response);
  }

  async updatePet(id: number, petData: PetData) {
    return this.request(`/pets/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(petData),
    });
  }

  async deletePet(id: number) {
    return this.request(`/pets/${id}/`, {
      method: 'DELETE',
    });
  }

  // ======================
  // Profile endpoints
  // ======================
  async getProfile() {
    return this.request('/profile_details/');
  }

  async updateProfile(profileData: ProfileData) {
    return this.request('/profiles/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // ======================
  // Pet Report endpoints
  // ======================
  async getPetReports() {
    return this.request('/pet-reports/');
  }

  async createPetReport(reportData: PetReportData) {
    return this.request('/pet-reports/', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async createPetReportWithImage(reportData: FormData) {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/pet-reports/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: reportData,
    });
    return this.handleResponse(response);
  }

  // ======================
  // Pet Adoption endpoints
  // ======================
  async getPetAdoptions() {
    return this.request('/pet-adoptions/');
  }

  async createAdoptionRequest(petId: number, message: string) {
    const adoptionData: AdoptionRequest = { pet: petId, message };
    return this.request('/pet-adoptions/', {
      method: 'POST',
      body: JSON.stringify(adoptionData),
    });
  }

  // ======================
  // Utility
  // ======================
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
}

export const apiService = new ApiService();
