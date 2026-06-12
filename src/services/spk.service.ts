import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs'; // 1. Import ini wajib
import { environment } from '../environments/environment';
import { PenilaianRequest, HasilRekomendasiDto, AnalitikResponse } from '../model';

@Injectable({
  providedIn: 'root'
})
export class SpkService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Gunakan Promise<T> sebagai return type
  async savePenilaianBulk(data: any): Promise<any> {
    // 2. Bungkus request dengan lastValueFrom
    const request$ = this.http.post(`${this.apiUrl}/penilaian/bulk`, data, { responseType: 'text' });
    return await lastValueFrom(request$);
  }

  async hitungRekomendasi(nim: string): Promise<HasilRekomendasiDto[]> {
    const request$ = this.http.post<HasilRekomendasiDto[]>(`${this.apiUrl}/spk/hitung/${nim}`, {});
    return await lastValueFrom(request$);
  }

  async getAnalitikData(): Promise<AnalitikResponse> {
    const request$ = this.http.get<AnalitikResponse>(`${this.apiUrl}/penilaian/analitik`);
    return await lastValueFrom(request$);
  }

  getHistoryPenilaian(nim: string): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/spk/history/${nim}`));
  }

  getHasilAktif(nim: string): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${this.apiUrl}/spk/hasil-aktif/${nim}`));
  }

  downloadRaportPdf(historyId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/spk/download-pdf/${historyId}`, {
      responseType: 'blob'
    });
  }

  downloadRaportPdfByNim(nim: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/spk/download-pdf-by-nim/${nim}`, {
      responseType: 'blob'
    });
  }
}