export interface SoalTestDto {
  id?: number;
  pertanyaan: string;
  // Map<String, String> di Java menjadi Object di JSON
  opsi: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  jawabanBenar: string;
  bidangId: number;
  point?: number;
}