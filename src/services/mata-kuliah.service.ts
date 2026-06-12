import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment'; // Sesuaikan path environment Anda
import { MataKuliahDto } from '../model'; // Sesuaikan path model Anda

@Injectable({
  providedIn: 'root'
})
export class MataKuliahService {
  private apiUrl = `${environment.apiUrl}/mata-kuliah`;

  constructor(private http: HttpClient) {}

  // 1. Ambil Semua Data Mata Kuliah (Untuk Management Admin)
  async getAll(): Promise<MataKuliahDto[]> {
    const request$ = this.http.get<MataKuliahDto[]>(this.apiUrl);
    return await lastValueFrom(request$);
  }

  // 2. Ambil Mata Kuliah Berdasarkan bidangId (Untuk dinilai di Modal Mahasiswa)
  async getByBidangId(bidangId: number): Promise<MataKuliahDto[]> {
    const request$ = this.http.get<MataKuliahDto[]>(`${this.apiUrl}/bidang/${bidangId}`);
    return await lastValueFrom(request$);
  }

  // 3. Ambil Satu Mata Kuliah Berdasarkan ID (Jika dibutuhkan)
  async getById(id: number): Promise<MataKuliahDto> {
    const request$ = this.http.get<MataKuliahDto>(`${this.apiUrl}/${id}`);
    return await lastValueFrom(request$);
  }

  // 4. UPSERT (Create dan Update jadi satu sesuai rancangan BE)
  async saveOrUpdate(data: MataKuliahDto): Promise<MataKuliahDto> {
    const request$ = this.http.post<MataKuliahDto>(this.apiUrl, data);
    return await lastValueFrom(request$);
  }

  // 5. Delete Mata Kuliah
  async delete(id: number): Promise<string> {
    const request$ = this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
    return await lastValueFrom(request$);
  }
}