// TypeScript interfaces for API responses
export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  pincode?: string;
  gender?: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
  is_superuser: boolean; // ✅ add this
}

export interface PetType {
  id: number;
  type: string;
}

export interface Pet {
  id: number;
  name: string;
  pet_type: string | PetType;
  gender?: string;
  breed?: string;
  color?: string;
  age?: number;
  weight?: number;
  description?: string;
  address?: string;
  state?: string;
  city?: string;
  pincode?: number;
  image?: string;
  is_diseased: boolean;
  is_vaccinated: boolean;
  created_date: string;
  modified_date: string;
  created_by?: User;
  modified_by?: User;
}

export interface PetReport {
  id: number;
  pet: Pet;
  user: User;
  pet_status: 'Lost' | 'Found' | 'Adopted';
  report_status: 'Pending' | 'Accepted' | 'Resolved' | 'Reunited';
  image?: string;
  is_resolved: boolean;
  created_date: string;
  modified_date: string;
}

export interface PetAdoption {
  id: number;
  pet: Pet;        // full object
  requestor: User; // full object
  message?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_date: string;
  modified_date: string;
}


export interface Notification {
  id: number;
  sender: User;
  receiver?: User;
  content: string;
  pet?: Pet;
  report?: PetReport;
  is_read: boolean;
  created_at: string;
}

export interface LostPetRequest {
  pet: Partial<Pet>;
  report: Partial<PetReport>;
  medical_history?: {
    last_vaccinated_date?: string;
    vaccination_name?: string;
    disease_name?: string;
    stage?: number;
    no_of_years?: number;
  };
}

export interface AdminApprovalRequest {
  request_type: 'lost' | 'found' | 'adopt';
  pet_id: number;
  action: 'approve' | 'reject';
}

export interface PetAdoptionRequest {
  pet: number;  // only the ID is needed for creation
  message?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface PetMedicalHistory {
  id: number;
  pet: number; // or Pet if you want full pet details
  last_vaccinated_date?: string;
  vaccination_name?: string;
  disease_name?: string;
  stage?: string;
  no_of_years?: string;
  created_date: string;
  modified_date: string;
}


const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private getMultipartHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.detail || error.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...this.getAuthHeaders(),
      ...options.headers,
    },
  });
  return this.handleResponse<T>(response);
}


  // Auth endpoints
  async login(email: string, password: string): Promise<{
  refresh_token: string;
  access_token: string;
  user_id: number;
  username: string;
  email: string;
  is_superuser: boolean;
}> {
  const response = await this.request<{
    refresh_token: string;
    access_token: string;
    user_id: number;
    username: string;
    email: string;
    is_superuser: boolean;
  }>('/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (response.access_token) {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
  }

  return response;
}

  async register(userData: {
    username: string;
    email: string;
    password: string;
    gender?: string;
    phone?: string;
    address?: string;
    pincode?: string;
  }): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>('/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Profile endpoints
  async getProfile(): Promise<User> {
    return this.request<User>('/profile_details/');
  }

  // Pet endpoints
  async getPets(): Promise<Pet[]> {
    return this.request<Pet[]>('/pets/');
  }

  async getPet(id: number): Promise<Pet> {
    return this.request<Pet>(`/pets/${id}/`);
  }

  async createPet(petData: Partial<Pet>): Promise<Pet> {
    return this.request<Pet>('/pets/', {
      method: 'POST',
      body: JSON.stringify(petData),
    });
  }

  async createPetWithImage(petData: FormData): Promise<Pet> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}/pets/`, {
    method: 'POST',
    headers: {
      ...this.getMultipartHeaders(),
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: petData,
  });
  return this.handleResponse<Pet>(response);
}

  async updatePet(id: number, petData: Partial<Pet>): Promise<Pet> {
    return this.request<Pet>(`/pets/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(petData),
    });
  }

  async deletePet(id: number): Promise<void> {
    return this.request<void>(`/pets/${id}/`, {
      method: 'DELETE',
    });
  }

  // Lost Pet Request (New API)
  async createLostPetRequest(requestData: LostPetRequest & { pet_image?: File }): Promise<{
    message: string;
    pet_id: number;
    report_id: number;
    notification_id: number;
  }> {
    const formData = new FormData();
    
    // Add JSON data
    formData.append('pet', JSON.stringify(requestData.pet));
    formData.append('report', JSON.stringify(requestData.report));
    
    if (requestData.medical_history) {
      formData.append('medical_history', JSON.stringify(requestData.medical_history));
    }
    
    // Add image file if provided
    if (requestData.pet_image) {
      formData.append('pet_image', requestData.pet_image);
    }

    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/lost-pet-request/`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        // Don't set Content-Type - let browser handle it for FormData
      },
      body: formData,
    });
    
    return this.handleResponse<{
      message: string;
      pet_id: number;
      report_id: number;
      notification_id: number;
    }>(response);
  }

  async getLostPets(): Promise<{ lost_pets: Array<{
    report_id: number;
    report_status: string;
    pet_status: string;
    image?: string;
    pet: {
      id: number;
      name: string;
      pet_type?: string;
      breed?: string;
      age?: number;
      color?: string;
    };
  }> }> {
    return this.request<{ lost_pets: Array<{
      report_id: number;
      report_status: string;
      pet_status: string;
      image?: string;
      pet: {
        id: number;
        name: string;
        pet_type?: string;
        breed?: string;
        age?: number;
        color?: string;
      };
    }> }>('/lost-pet-request/');
  }

  // Admin Notifications (New API)
  async getAdminNotifications(): Promise<{ notifications: Array<{
    notification_id: number;
    sender?: string;
    content: string;
    created_at: string;
    pet?: Pet;
    report?: PetReport;
  }> }> {
    return this.request<{ notifications: Array<{
      notification_id: number;
      sender?: string;
      content: string;
      created_at: string;
      pet?: Pet;
      report?: PetReport;
    }> }>('/admin/notifications/');
  }

  async getUnreadAdminNotificationCount(): Promise<{ unread_count: number }> {
  return this.request<{ unread_count: number }>('/admin/notifications/unread-count/');
}

  // Admin Approval (New API)
  async adminApproval(approvalData: AdminApprovalRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>('/admin/approve/', {
      method: 'POST',
      body: JSON.stringify(approvalData),
    });
  }
  // Pets List by Tab (New API)
  async getPetsByTab(tab: 'lost' | 'found' | 'adopt'): Promise<{ results: PetReport[] | PetAdoption[] }> {
    return this.request<{ results: PetReport[] | PetAdoption[] }>(`/pets-list/?tab=${tab}`);
  }


  // User Notifications (New API)
  async getUserNotifications(): Promise<{ notifications: Notification[] }> {
    return this.request<{ notifications: Notification[] }>('/get-notifications/');
  }

  // User Requests (New API)
  async getUserRequests(): Promise<{
    reports: Array<{
      id: number;
      pet_name: string;
      pet_status: string;
      report_status: string;
      image?: string;
      is_resolved: boolean;
    }>;
    adoptions: Array<{
      id: number;
      pet_name: string;
      status: string;
    }>;
  }> {
    return this.request<{
      reports: Array<{
        id: number;
        pet_name: string;
        pet_status: string;
        report_status: string;
        image?: string;
        is_resolved: boolean;
      }>;
      adoptions: Array<{
        id: number;
        pet_name: string;
        status: string;
      }>;
    }>('/my-requests/');
  }

  // Pet Types
  async getPetTypes(): Promise<PetType[]> {
    return this.request<PetType[]>('/pet-types/');
  }

  async createPetType(typeData: { type: string }): Promise<PetType> {
    return this.request<PetType>('/pet-types/', {
      method: 'POST',
      body: JSON.stringify(typeData),
    });
  }

  // Pet Medical History
  async getPetMedicalHistory(): Promise<PetMedicalHistory[]> {
  return this.request<PetMedicalHistory[]>('/pet-medical-history/');
}

async createPetMedicalHistory(
  historyData: Partial<PetMedicalHistory>
): Promise<PetMedicalHistory> {
  return this.request<PetMedicalHistory>('/pet-medical-history/', {
    method: 'POST',
    body: JSON.stringify(historyData),
  });
}

  // Update Profile
  async updateProfile(profileData: Partial<User>): Promise<User> {
    return this.request<User>('/profiles/profile_details/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Pet Reports
  async getPetReports(): Promise<PetReport[]> {
    return this.request<PetReport[]>('/pet-reports/');
  }

  async createPetReport(reportData: Partial<PetReport>): Promise<PetReport> {
    return this.request<PetReport>('/pet-reports/', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async updatePetReport(id: number, reportData: Partial<PetReport>): Promise<PetReport> {
    return this.request<PetReport>(`/pet-reports/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(reportData),
    });
  }

  async deletePetReport(id: number): Promise<void> {
    return this.request<void>(`/pet-reports/${id}/`, {
      method: 'DELETE',
    });
  }
  // Pet Adoptions
  async getPetAdoptions(): Promise<PetAdoption[]> {
    return this.request<PetAdoption[]>('/pet-adoptions/');
  }

  async createPetAdoption(adoptionData: PetAdoptionRequest): Promise<PetAdoption> {
  return this.request<PetAdoption>('/pet-adoptions/', {
    method: 'POST',
    body: JSON.stringify(adoptionData),
  });
}


  async updatePetAdoption(id: number, adoptionData: Partial<PetAdoption>): Promise<PetAdoption> {
    return this.request<PetAdoption>(`/pet-adoptions/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(adoptionData),
    });
  }

  async deletePetAdoption(id: number): Promise<void> {
    return this.request<void>(`/pet-adoptions/${id}/`, {
      method: 'DELETE',
    });
  }
  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>('/notifications/');
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    // 👈 The URL must include the custom action name 'mark_as_read'
    return this.request<Notification>(`/notifications/${id}/mark_as_read/`, {
        method: 'PATCH',
    });
}

  async deleteNotification(id: number): Promise<void> {
    return this.request<void>(`/notifications/${id}/`, {
      method: 'DELETE',
    });
  }

  // Profile endpoints (ViewSet methods)
  async getProfiles(): Promise<User[]> {
    return this.request<User[]>('/profiles/');
  }

  async createProfile(profileData: Partial<User>): Promise<User> {
    const formData = new FormData();
    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string | Blob);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/profiles/`, {
      method: 'POST',
      headers: this.getMultipartHeaders(),
      body: formData,
    });
    return this.handleResponse<User>(response);
  }

  async deleteProfile(id: number): Promise<void> {
    return this.request<void>(`/profiles/${id}/`, {
      method: 'DELETE',
    });
  }
  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getImageUrl(imagePath?: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = API_BASE_URL.replace('/api', '');
    if (imagePath.startsWith('/media/')) return `${baseUrl}${imagePath}`;
    if (imagePath.startsWith('media/')) return `${baseUrl}/${imagePath}`;
    return `${baseUrl}/media/${imagePath}`;
  }
}

export const apiService = new ApiService();