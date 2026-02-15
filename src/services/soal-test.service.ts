import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs'; // 1. Wajib import ini
import { environment } from '../environments/environment';
import { SoalTestDto } from '../model'; // Pastikan path import model benar

@Injectable({
  providedIn: 'root'
})
export class SoalTestService {
  private apiUrl = `${environment.apiUrl}/soal-tes`;

  constructor(private http: HttpClient) {}

  // 1. GET ALL
  // Mengembalikan Promise array
  async getAll(): Promise<SoalTestDto[]> {
    const request$ = this.http.get<SoalTestDto[]>(this.apiUrl);
    return await lastValueFrom(request$);
  }

  // 2. GET BY ID
  // Mengembalikan Promise object tunggal
  async getById(id: number): Promise<SoalTestDto> {
    const request$ = this.http.get<SoalTestDto>(`${this.apiUrl}/${id}`);
    return await lastValueFrom(request$);
  }

  // 3. POST (Create & Update)
  // Mengembalikan Promise string (karena backend return text)
  async saveOrUpdate(data: SoalTestDto): Promise<string> {
    const request$ = this.http.post(this.apiUrl, data, { responseType: 'text' });
    // Kita perlu cast return-nya karena http.post dengan 'text' kadang dianggap Object oleh TS strict
    return await lastValueFrom(request$);
  }

  // 4. DELETE
  // Mengembalikan Promise string
  async delete(id: number): Promise<string> {
    const request$ = this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
    return await lastValueFrom(request$);
  }
}