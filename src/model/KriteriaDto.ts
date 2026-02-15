import { TipeKriteria } from "../enum";

export interface KriteriaDto {
  id?: number;
  kode: string;     // C1, C2, dll
  namaKriteria: string;
  bobot: number;
  tipe: TipeKriteria;     
}