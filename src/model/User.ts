export interface User {
  id: string;   // Opsional, tapi biasanya ada
  name: string;
  role: 'admin' | 'user'; // Sesuaikan dengan role Anda
  email?: string;
  nim?: string;
  token?: string; // Token autentikasi, jika diperlukan
}