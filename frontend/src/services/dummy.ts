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
  is_superuser: boolean;
}

export interface PetData {
  name: string;
  pet_type: string;
  breed: string;
  color: string;
  age?: number | null;
  description: string | null;
  city: string | null;
  state: string | null;
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

// ======================
// Base API URL
// ======================
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// ======================
// ApiService
// ======================
class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: Bearer ${token} }),
    };
  }

  private getAuthHeadersForFormData() {
    const token = localStorage.getItem('access_token');
    return {
      ...(token && { Authorization: Bearer ${token} }),
    };
  }

  // Build absolute image URLs
  getImageUrl(profileImagePath?: string | null) {
    if (!profileImagePath) return '';
    if (profileImagePath.startsWith('http')) return profileImagePath;

    const base = API_BASE_URL.replace(/\/api\/?$/, '');
    return ${base}${profileImagePath.startsWith('/') ? '' : '/'}${profileImagePath};
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json().catch(async () => {
        const txt = await response.text().catch(() => '');
        return { message: txt || 'Network error' };
      });
      // ✅ Throw the parsed object so UI can display details
      throw error;
    }
    if (response.status === 204) return true;
    return response.json();
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = ${API_BASE_URL}${endpoint};
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
  // Auth
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

  async change_Password(passwordData: ChangePasswordData) {
    return this.request('/profiles/change-password/', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  async logout() {
    try {
      await this.request('/logout/', { method: 'POST' });
    } catch {
      // ignore if backend doesn’t have logout
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // ======================
  // Profile (your “me” endpoint)
  // ======================
  async getProfile(): Promise<CurrentUser> {
    return this.request('/profile_details/');
  }

  async updateProfile(id: number, profileData: any) {
    const isFormData = profileData instanceof FormData;
    const url = ${API_BASE_URL}/profiles/${id}/;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: isFormData ? this.getAuthHeadersForFormData() : this.getAuthHeaders(),
      body: isFormData ? profileData : JSON.stringify(profileData),
    });

    return this.handleResponse(response);
  }

  async updateProfileWithImage(id: number, profileData: FormData) {
    const url = ${API_BASE_URL}/profiles/${id}/;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getAuthHeadersForFormData(),
      body: profileData,
    });
    return this.handleResponse(response);
  }

  async deleteProfile(id: number) {
    return this.request(/profiles/${id}/, { method: 'DELETE' });
  }

  // ======================
  // Pets
  // ======================
  async getPets() {
    return this.request('/pets/');
  }

  async getPet(id: number) {
    return this.request(/pets/${id}/);
  }

  async createPet(petData: PetData) {
    return this.request('/pets/', {
      method: 'POST',
      body: JSON.stringify(petData),
    });
  }

  async createPetWithImage(petData: FormData) {
    const token = localStorage.getItem('access_token');
    const response = await fetch(${API_BASE_URL}/pets/, {
      method: 'POST',
      headers: { Authorization: Bearer ${token} },
      body: petData,
    });
    return this.handleResponse(response);
  }

  async updatePet(id: number, petData: PetData) {
    return this.request(/pets/${id}/, {
      method: 'PUT',
      body: JSON.stringify(petData),
    });
  }

  async deletePet(id: number) {
    return this.request(/pets/${id}/, { method: 'DELETE' });
  }

  // ======================
  // Pet Reports
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
    const response = await fetch(${API_BASE_URL}/pet-reports/, {
      method: 'POST',
      headers: { Authorization: Bearer ${token} },
      body: reportData,
    });
    return this.handleResponse(response);
  }

  // ======================
  // Pet Adoptions
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
  // Admin Users
  // ======================
  // Added gender & superuser (role) query params so frontend filters work.
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

    const query = qs.toString() ? ?${qs.toString()} : '';
    return this.request(/admin/users/${query});
  }

  async changePassword(data: { current_password: string; new_password: string }) {
  return this.request('/admin/change-password/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

  // ======================
  // Utility
  // ======================
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  // ======================
  // Account Switching
  // ======================
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
}

export const apiService = new ApiService();