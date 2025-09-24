// TypeScript interfaces for API responses
export interface FeedbackStory {
  id: number;
  user: string;        // comes from StringRelatedField
  title: string;
  story: string;
  pet_name: string;
  submitted_at: string; // ISO datetime string
  image?: string;       
}
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

export interface ProfileData {
  username: string;
  email: string;
  password?: string;
  gender?: string;
  phone?: string;
  address?: string;
  pincode?: string;
  profile_image?: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface StoredAccount {
  id: string;
  username: string;
  email: string;
  profile_image?: string | null;
  lastUsed: string;
}

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  // add extra fields as your backend returns them
}

export interface AdminUser {
 id: number;
 username: string;
 email: string;
 is_active: boolean;
 is_staff: boolean;
 is_superuser: boolean;
 // other fields optionally returned by admin user list
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
  report_id?: number;
  medical_history?: { 
        last_vaccinated_date?: string;
        vaccination_name?: string;
        disease_name?: string;
        stage?: string;
        no_of_years?: string;
    } | null;
}
export interface PetReportResponse {
  pet?: {
    id: number;
    name?: string;
    pet_type?: string | PetType;
    breed?: string;
    color?: string;
    age?: number;
    weight?: number;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    gender?: string;
    pincode?: number;
    image?: string;
    is_diseased?: boolean;
    is_vaccinated?: boolean;
    modified_date?: string;
  };
  image?: string;
  created_date: string;
}

export interface PetReport {
  id: number;
  pet: Pet;
  user: User;
  pet_status: 'Lost' | 'Found' | 'Adopted';
  report_status: 'Pending' | 'Accepted'| 'Rejected' | 'Resolved' | 'Reunited';
  image?: string;
  is_resolved: boolean;
  created_date: string;
  modified_date: string;
}

export interface PetAdoption {
  id: number;
  pet: {
    id: number;
    name: string;
  };
  requestor: {
    id: number;
    username: string;
    email: string;
  };
  // The 'message' property can sometimes be null or undefined
  message?: string; 
  status: 'Pending' | 'Approved' | 'Rejected';
  // Add the missing properties
  created_by: string | null;
  modified_by: string | null;
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

export interface LostPetRequestCreate {
  pet: Partial<Pet>;
  report: Partial<PetReport>;
  medical_history?: {
    last_vaccinated_date?: string;
    vaccination_name?: string;
    disease_name?: string;
    stage?: number;
    no_of_years?: number;
  };
  pet_image?: File;
}

// For fetching Lost Pet requests (GET)
export interface LostPetRequest {
  report_id: number;
  report_status: string;
  pet_status: string;
  image?: string;
  created_date?: string;
  pet: {
    id: number;
    name: string;
    pet_type?: string;
    breed?: string;
    age?: number;
    color?: string;
  };
  address?: string; 
    city?: string;
    state?: string;
    gender?: string;
    description?:string;
    is_diseased: boolean; // Correct
    is_vaccinated: boolean; // Correct
    medical_history?: { 
        last_vaccinated_date?: string;
        vaccination_name?: string;
        disease_name?: string;
        stage?: string;
        no_of_years?: string;
    } | null;
}

export interface MyLostPetResponse {
  report_id: number;
  report_status: string;
  pet_status: string;
  image?: string;
  created_date: string;
  pet: Pet; 
}

export interface AdminApprovalRequest {
  request_type: 'lost' | 'found' | 'adopt';
  pet_id: number;
  action: 'approve' | 'reject';
}

export interface PetAdoptionRequest {
  // ⭐ CHANGED: The key is now 'pet_id' to match the backend serializer
  pet_id: number;  
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
export interface AdminPetReport {
  id: number;
  pet: Pet;
  user: string; // This is the username string
  image_url?: string;
  pet_status: 'Lost' | 'Found' | 'Adopted';
  report_status: 'Pending' | 'Accepted'| 'Rejected' | 'Resolved' | 'Reunited';
  created_date: string;
  modified_date: string; // Now included from the serializer
}
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  pincode?: string;
  gender?: string;
  profile_image?: string;
  is_superuser: boolean;
}
interface Reward {
  user: number;   // ✅ add this
  points: number;
  badge: string;
  reason: string;
  username: string;
  email: string;
}
// 1️⃣ Create a type for adoptable pets response
export interface AdoptablePet {
  report_id: number;
  report_status: string;
  pet_status: string;
  image?: string;
  created_date?: string;
  pet: {
    id: number;
    name: string;
    pet_type?: string;
    breed?: string;
    age?: number;
    color?: string;
    address?: string; 
    city?: string;
    state?: string;
    pincode?: number;
    gender?: string;
    description?: string;
    is_diseased: boolean;
    is_vaccinated: boolean;
    medical_history?: { 
      last_vaccinated_date?: string;
      vaccination_name?: string;
      disease_name?: string;
      stage?: string;
      no_of_years?: string;
    } | null;
  };
}

export interface UserReportPayload {
  pet_report_id: number;
  report_type: 'Sighting' | 'Reclaim' | 'Adoption';
  message: string;
}
export interface AdminUserReport {
  id: number;
  pet_report: AdminPetReport;
  pet_report_creator: UserProfile;
  report_type: 'Sighting' | 'Reclaim' | 'Adoption';
  message: string;
  report_status: 'Pending' | 'Accepted' | 'Rejected' | 'Reunited' | 'Resolved';
  created_date: string;
  modified_date: string;
  created_by: UserProfile;   
  modified_by: UserProfile;
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
  private getAuthHeadersForFormData() {
  const token = localStorage.getItem('access_token');
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
    // ❌ Do NOT add 'Content-Type'
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
  const isFormData = options.body instanceof FormData;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? this.getAuthHeadersForFormData() : this.getAuthHeaders()),
      // ...this.getAuthHeaders(),
      ...options.headers,
    },
  });
  if (response.status === 401) {
    this.logout();
    window.location.href = "/login"; // 🔴 force redirect if token invalid
  }
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
  // Remove only auth-related keys, not everything in localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("is_superuser");
  localStorage.removeItem("currentAccountId");
  localStorage.removeItem("storedAccounts");
}


  // Profile endpoints
  async getProfile(): Promise<CurrentUser> {
 return this.request('/profile_details/');
 }

  async updateProfile(id: number, profileData: Partial<ProfileData> | FormData) {
    const isFormData = profileData instanceof FormData;
    const url = `${API_BASE_URL}/profiles/${id}/`;

    const response = await fetch(url, {
    method: 'PATCH',
    headers: isFormData ? this.getAuthHeadersForFormData() : this.getAuthHeaders(),
    body: isFormData ? profileData : JSON.stringify(profileData),
    });
    return this.handleResponse(response);
 }

async updateProfileWithImage(id: number, profileData: FormData) {
 const url = `${API_BASE_URL}/profiles/${id}/`;
 const response = await fetch(url, {
 method: 'PATCH',
 headers: this.getAuthHeadersForFormData(),
 body: profileData,
 });
 return this.handleResponse(response);
 }

 async deleteProfile(id: number) {
 return this.request(`/profiles/${id}/`, { method: 'DELETE' });
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
      method: 'PATCH',
      body: JSON.stringify(petData),
    });
  }

  async deletePet(id: number): Promise<void> {
    return this.request<void>(`/pets/${id}/`, {
      method: 'DELETE',
    });
  }

  // Lost Pet Request (New API)
  // POST
async createLostPetRequest(requestData: LostPetRequestCreate): Promise<{
  message: string;
  pet_id: number;
  report_id: number;
  notification_id: number;
}> {
  const formData = new FormData();
  
  formData.append('pet', JSON.stringify(requestData.pet));
  formData.append('report', JSON.stringify(requestData.report));
  
  if (requestData.medical_history) {
    formData.append('medical_history', JSON.stringify(requestData.medical_history));
  }
  if (requestData.pet_image) {
    formData.append('pet_image', requestData.pet_image);
  }

  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}/lost-pet-request/`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: formData,
  });

  return this.handleResponse(response);
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
    address?: string; 
      city?: string;
      state?: string;
      gender?: string;
      description?:string;
      is_diseased: boolean; // Displayed in the status section
      is_vaccinated: boolean; // Displayed in the status section
      medical_history?: { 
        last_vaccinated_date?: string;
        vaccination_name?: string;
        disease_name?: string;
        stage?: string;
        no_of_years?: string;
      } | null;
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
      address?: string; 
      city?: string;
      state?: string;
      gender?: string;
      description?:string;
      is_diseased: boolean; // Displayed in the status section
      is_vaccinated: boolean; // Displayed in the status section
      medical_history?: { 
        last_vaccinated_date?: string;
        vaccination_name?: string;
        disease_name?: string;
        stage?: string;
        no_of_years?: string;
      } | null;
    }> }>('/lost-pet-request/');
  }

  // GET (for admin)
async getAdminLostPets(): Promise<AdminPetReport[]> {
    return this.request<AdminPetReport[]>('/admin/lost-pet-requests/');
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

  async manageReportStatus(reportId: number, status: 'Accepted' | 'Resolved' | 'Reunited'): Promise<{ message: string }> {
  return this.request<{ message: string }>(`/admin/manage-report/${reportId}/`, {
    method: 'PATCH',
    body: JSON.stringify({ report_status: status }),
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
  // async updateProfile(profileData: Partial<User>): Promise<User> {
  //   return this.request<User>('/profiles/profile_details/', {
  //     method: 'PUT',
  //     body: JSON.stringify(profileData),
  //   });
  // }

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
      method: 'PATCH',
      body: JSON.stringify(reportData),
    });
  }
  async getAdminFoundPets(): Promise<AdminPetReport[]> {
    return this.request<AdminPetReport[]>('/admin/found-pet-requests/');
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

  async updatePetAdoption(id: number, adoptionData: Partial<PetAdoption>): Promise<PetAdoption> {
    return this.request<PetAdoption>(`/pet-adoptions/${id}/`, {
      method: 'PATCH',
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
async changePassword(data: { current_password: string; new_password: string }) {
 return this.request('/admin/change-password/', {
 method: 'POST',
 body: JSON.stringify(data),
});
 }
  // async deleteProfile(id: number): Promise<void> {
  //   return this.request<void>(`/profiles/${id}/`, {
  //     method: 'DELETE',
  //   });
  // }
  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // getImageUrl(imagePath?: string): string {
  //   if (!imagePath) return '';
  //   if (imagePath.startsWith('http')) return imagePath;
  //   const baseUrl = API_BASE_URL.replace('/api', '');
  //   if (imagePath.startsWith('/media/')) return `${baseUrl}${imagePath}`;
  //   if (imagePath.startsWith('media/')) return `${baseUrl}/${imagePath}`;
  //   return `${baseUrl}/media/${imagePath}`;
  // }
  getImageUrl(imagePath?: string): string {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseUrl = API_BASE_URL.replace('/api', '');
  if (imagePath.startsWith('/media/')) return `${baseUrl}${imagePath}`;
  if (imagePath.startsWith('media/')) return `${baseUrl}/${imagePath}`;
  return `${baseUrl}/media/${imagePath}`;
}
async change_Password(passwordData: ChangePasswordData) {
 return this.request('/profiles/change-password/', {
 method: 'POST',
 body: JSON.stringify(passwordData),
 });
}
async getAdminUsers(params?: {
 search?: string;
 role?: string;
 page?: number;
 gender?: string;
 superuser?: string;
}): Promise<AdminUser[] | { results: AdminUser[]; count: number }> {
 const qs = new URLSearchParams();
 if (params?.search) qs.set('search', params.search);
 if (params?.role && params.role !== 'all') qs.set('role', params.role);
 if (params?.page) qs.set('page', String(params.page));
 // NEW filter params supported by your backend view:
 if (params?.gender) qs.set('gender', params.gender);
 if (params?.superuser) qs.set('superuser', params.superuser);
 const query = qs.toString() ? `?${qs.toString()}` : '';
 return this.request(`/admin/users/${query}`);
 }
getStoredAccounts(): StoredAccount[] {
 const data = localStorage.getItem('storedAccounts');
 return data ? JSON.parse(data) : [];
 }

  saveStoredAccounts(accounts: StoredAccount[]) {
 localStorage.setItem('storedAccounts', JSON.stringify(accounts));
 }

  addStoredAccount(account: StoredAccount): boolean {
 const accounts = this.getStoredAccounts();
 const exists = accounts.find(a => a.id === account.id);
 if (exists) {
 const updated = accounts.map(a => (a.id === account.id ? { ...a, ...account } : a));
 this.saveStoredAccounts(updated);
 return true;
 }
 accounts.unshift(account);
 this.saveStoredAccounts(accounts);
 return true;
 }
switchToAccount(accountId: string): boolean {
 const accounts = this.getStoredAccounts();
 const account = accounts.find(acc => acc.id === accountId);
if (!account) return false;

 account.lastUsed = new Date().toISOString();
 this.saveStoredAccounts(accounts);
 localStorage.setItem('currentAccountId', accountId);
 return true;
 }

  removeAccount(accountId: string): boolean {
 let accounts = this.getStoredAccounts();
  accounts = accounts.filter(acc => acc.id !== accountId);
   this.saveStoredAccounts(accounts);

   const currentId = this.getCurrentAccountId();
   if (currentId === accountId) {
   localStorage.removeItem('currentAccountId');
  }
   return true;
   }

   getCurrentAccountId(): string | null {
   return localStorage.getItem('currentAccountId');
   }

  updateCurrentAccountProfile(updatedProfile: Partial<ProfileData>): boolean {
   const currentId = this.getCurrentAccountId();
   if (!currentId) return false;
   const accounts = this.getStoredAccounts();
   const idx = accounts.findIndex(a => a.id === currentId);
   if (idx === -1) return false;

   const existing = accounts[idx];
   const merged = {
   ...existing,
   username: (updatedProfile.username as string) ?? existing.username,
   email: (updatedProfile.email as string) ?? existing.email,
   profile_image: (updatedProfile.profile_image as string | null) ?? existing.profile_image,
   };
    accounts[idx] = merged;
   this.saveStoredAccounts(accounts);
   return true;
   }
  async getFoundPets(): Promise<{ found_pets: Array<{
    report_id: number;
    report_status: string;
    pet_status: string;
    image?: string;
    created_date?: string;
    pet: {
      id: number;
      name: string;
      pet_type?: string;
      breed?: string;
      age?: number;
      color?: string;
      address?: string; 
      city?: string;
      state?: string;
      pincode?: number; // Added pincode for consistency
      gender?: string;
      description?: string; // Added description
      is_diseased: boolean;
      is_vaccinated: boolean;
      medical_history?: { 
        last_vaccinated_date?: string;
        vaccination_name?: string;
        disease_name?: string;
        stage?: string;
        no_of_years?: string;
      } | null;
    };
  }> }> {
    return this.request<{ found_pets: Array<{
      report_id: number;
      report_status: string;
      pet_status: string;
      image?: string;
      created_date?: string;
      pet: {
        id: number;
        name: string;
        pet_type?: string;
        breed?: string;
        age?: number;
        color?: string;
        address?: string; 
        city?: string;
        state?: string;
        pincode?: number;
        gender?: string;
        description?: string;
        is_diseased: boolean;
        is_vaccinated: boolean;
        medical_history?: { 
          last_vaccinated_date?: string;
          vaccination_name?: string;
          disease_name?: string;
          stage?: string;
          no_of_years?: string;
        } | null;
        
      };
    }> }>('/found-pet-request/'); // ⭐ NEW ENDPOINT
  }

async getMyLostPets(): Promise<{ lost_pets: MyLostPetResponse[] }> {
    return this.request<{ lost_pets: MyLostPetResponse[] }>('/my-lost-pets/');
  }
async getMyFoundPets(): Promise<{ found_pets: MyLostPetResponse[] }> {
    return this.request<{ found_pets: MyLostPetResponse[] }>('/my-found-pets/');
  }
async createMedicalHistory(data: Partial<PetMedicalHistory>): Promise<PetMedicalHistory> {
    return this.request<PetMedicalHistory>('/pet-medical-history/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
async updateMedicalHistory(id: number, data: Partial<PetMedicalHistory>): Promise<PetMedicalHistory> {
    return this.request<PetMedicalHistory>(`/pet-medical-history/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
async getMedicalHistoryForPet(petId: number): Promise<PetMedicalHistory | null> {
    try {
      // A standard ViewSet supports filtering via query parameters
      const response = await this.request<PetMedicalHistory[]>(`/pet-medical-history/?pet=${petId}`);
      // The response will be an array, we just need the first (and likely only) item
      return response.length > 0 ? response[0] : null;
    } catch (error) {
      console.error('Failed to fetch medical history:', error);
      return null;
  }
}
async getAdoptionPets(): Promise<Pet[]> {
  try {
    const response = await this.request<Pet[]>("/adoption-pets/");
    return response;
  } catch (error) {
    console.error("Failed to fetch adoption pets:", error);
    return [];
  }
}
// api.ts
// ApiService.ts


async getMyPetAdoptions(): Promise<PetAdoption[]> {
    return this.request<PetAdoption[]>('/my-pet-adoptions/');
  }
  
  async createPetAdoption(adoptionData: PetAdoptionRequest): Promise<PetAdoption> {
    // The implementation here remains the same, it just sends the data it receives.
    return this.request<PetAdoption>('/pet-adoptions/', {
      method: 'POST',
      body: JSON.stringify(adoptionData),
  });
  }
async getAdoptablePets(): Promise<{ adoptable_pets: AdoptablePet[] }> {
  return this.request<{ adoptable_pets: AdoptablePet[] }>('/adoptable-pets/');
}
  async getAllRewards(): Promise<Reward[]> {
  return this.request('/all-rewards/');  
}

async getMyRewards(): Promise<Reward> {
  return this.request('/my-rewards/');    
}
async createFeedbackStory(data: FormData) {
    return this.request("/feedback-stories/", {
      method: "POST",
      body: data,
      headers: {}, // let browser set multipart/form-data
    });
  }

  // ======================
// Feedback Stories
// ======================
async getFeedbackStories(): Promise<FeedbackStory[]> {
  // Returns an array of FeedbackStory objects from backend
  return this.request('/feedback-stories/');
}
async createUserReport(payload: UserReportPayload): Promise<AdminUserReport> {
  return this.request<AdminUserReport>('/user-reports/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

  async getAdminUserReports(): Promise<AdminUserReport[]> {
    return this.request<AdminUserReport[]>('/user-reports/');
  }
  async updateUserReportStatus(
    reportId: number,
    status: 'Pending' | 'Accepted' | 'Rejected' | 'Reunited' | 'Resolved'
  ): Promise<AdminUserReport> {
    return this.request<AdminUserReport>(`/user-reports/${reportId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ report_status: status }),
  });
  }
  
}

export const apiService = new ApiService();