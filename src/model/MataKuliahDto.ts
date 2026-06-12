export interface MataKuliahDto {
  id?: number;          // Opsional karena saat create, id belum ada
  bidangId: number;     // Menghubungkan mata kuliah ke bidang tertentu
  namaMataKuliah: string;
}