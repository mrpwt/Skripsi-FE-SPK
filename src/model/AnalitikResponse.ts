export interface AnalitikResponse {
  totalMahasiswa: number;
  totalKriteria: number;
  totalBidang: number;
  rataRataNilai: number;
  rataRataPerKriteria: KriteriaStatDto[];
}


export interface KriteriaStatDto {
  kode: string;
  nama: string;
  rataRata: number;
}