export interface HasilRekomendasiDto {
  // NIM Mahasiswa
  nim: string;

  // ID Jurusan/Bidang yang direkomendasikan
  bidangId: number;

  // Nama Bidang (Opsional: Jika backend mengirim nama jurusan via DTO)
  // Sangat berguna agar di HTML tidak perlu mencari nama ID 1 itu apa
  namaBidang?: string; 

  // Hasil perhitungan SAW (contoh: 0.8750)
  skorAkhir: number;

  // Ranking (1, 2, 3)
  ranking: number;

  normalizedValues: { [key: string]: number };
}