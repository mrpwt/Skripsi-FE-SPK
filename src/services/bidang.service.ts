import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs'; // 1. Import wajib
import { environment } from '../environments/environment';
import { BidangDto } from '../model';

@Injectable({
  providedIn: 'root'
})
export class BidangService {
  private apiUrl = `${environment.apiUrl}/bidang`;

  constructor(private http: HttpClient) {}

  // 1. GET ALL
  async getAll(): Promise<BidangDto[]> {
    const request$ = this.http.get<BidangDto[]>(this.apiUrl);
    return await lastValueFrom(request$);
  }

  // 2. GET BY ID
  async getById(id: number): Promise<BidangDto> {
    const request$ = this.http.get<BidangDto>(`${this.apiUrl}/${id}`);
    return await lastValueFrom(request$);
  }

  // 3. POST (Create / Save)
  async save(data: BidangDto): Promise<BidangDto> {
    const request$ = this.http.post<BidangDto>(`${this.apiUrl}/save`, data);
    return await lastValueFrom(request$);
  }

  // 4. DELETE
  async delete(id: number): Promise<void> {
    const request$ = this.http.delete<void>(`${this.apiUrl}/${id}`);
    return await lastValueFrom(request$);
  }
}