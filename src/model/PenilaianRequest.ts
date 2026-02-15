export interface PenilaianRequest {
  // NIM Mahasiswa yang dinilai
  nim: string;

  // ID Kriteria (C1, C2, C3, dst.) - lihat tabel kriteria
  kriteriaId: number;

  // ID Bidang (1=RPL, 2=AI, 3=Cyber, dst.)
  // Penting karena di UI (Image 1) nilai dikelompokkan per bidang
  bidangId: number;

  // Nilai yang diinput (0 - 100)
  nilai: number;
}