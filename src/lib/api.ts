const API_URL = "http://localhost:5000";

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  // Debug log as requested
  console.log("Sending token:", localStorage.getItem("token"));

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// ─── Auth ────────────────────────────────────────────────────────────────────
export const apiSignup = async (payload: {
  name: string; email: string; age: number; phone: string; password: string;
}) => {
  return fetchWithAuth('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const apiLogin = async (email: string, password: string) => {
  return fetchWithAuth('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const apiGetMe = async () => {
  return fetchWithAuth('/api/auth/me');
};

// ─── Courses ─────────────────────────────────────────────────────────────────
export const apiGetCourses = async () => {
  return fetchWithAuth('/api/courses');
};

export const apiGetCourse = async (id: string) => {
  return fetchWithAuth(`/api/courses/${id}`);
};

export const apiMarkVideoComplete = async (courseId: string, videoId: string) => {
  return fetchWithAuth(`/api/courses/${courseId}/complete-video`, {
    method: 'PATCH',
    body: JSON.stringify({ videoId }),
  });
};

// ─── Payments ────────────────────────────────────────────────────────────────
export const apiRequestPayment = async (courseId: string, utrNumber?: string) => {
  return fetchWithAuth('/api/enroll/request', {
    method: 'POST',
    body: JSON.stringify({ courseId, utrNumber }),
  });
};

export const apiGetMyPayments = async () => {
  return fetchWithAuth('/api/payment/my');
};

// ─── Admin ───────────────────────────────────────────────────────────────────
export const apiAdminDashboard = async () => {
  return fetchWithAuth('/api/admin/dashboard');
};

export const apiAdminAllPayments = async () => {
  return fetchWithAuth('/api/payment/all');
};

export const apiAdminApprovePayment = async (paymentId: string) => {
  return fetchWithAuth(`/api/payment/approve/${paymentId}`, {
    method: 'PATCH',
  });
};

export const apiAdminRejectPayment = async (paymentId: string) => {
  return fetchWithAuth(`/api/payment/reject/${paymentId}`, {
    method: 'PATCH',
  });
};

export const apiSeedCourse = async () => {
  return fetchWithAuth('/api/admin/seed-course', {
    method: 'POST',
  });
};

export const apiGetAdminSecretData = async () => {
  return fetchWithAuth('/api/admin-dashboard-secret');
};
