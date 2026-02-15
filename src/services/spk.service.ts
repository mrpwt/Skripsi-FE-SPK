import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs'; // 1. Import ini wajib
import { environment } from '../environments/environment';
import { PenilaianRequest, HasilRekomendasiDto } from '../model';

@Injectable({
  providedIn: 'root'
})
export class SpkService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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
}