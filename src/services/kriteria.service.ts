import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs'; // Cukup pakai firstValueFrom untuk HTTP
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { KriteriaDto } from '../model';

@Injectable({
    providedIn: 'root'
})
export class KriteriaService {
    private apiUrl = `${environment.apiUrl}/kriteria`;

    constructor(private http: HttpClient) { }

    // 1. GET ALL (Sudah Benar: Convert String API -> Number Frontend)
    async getAll(): Promise<KriteriaDto[]> {
        const observable = this.http.get<any[]>(this.apiUrl).pipe(
            map(response => {
                return response.map(item => ({
                    id: item.id,
                    kode: item.kode,
                    namaKriteria: item.namaKriteria,
                    // Convert String ("0.25") jadi Number (0.25)
                    bobot: Number(item.bobot),
                    // Convert String ("1") jadi Number (1)
                    tipe: Number(item.tipe)
                } as KriteriaDto));
            })
        );
        return await firstValueFrom(observable);
    }

    // 2. GET BY ID
    async getById(id: number): Promise<KriteriaDto> {
        const observable = this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            map(item => ({
                ...item,
                bobot: Number(item.bobot),
                tipe: Number(item.tipe)
            } as KriteriaDto))
        );
        return await firstValueFrom(observable);
    }

    // 3. SAVE OR UPDATE (SATU PINTU POST)
    async saveOrUpdate(data: KriteriaDto): Promise<KriteriaDto> {

        // Konversi tipe ke String untuk Backend
        const payload = {
            ...data,
            tipe: String(data.tipe)
        };

        // KUNCI PERBAIKAN DI SINI:
        // 1. Tidak perlu IF/ELSE URL.
        // 2. Selalu gunakan POST ke 'this.apiUrl' (tanpa /id di ujung URL).
        // 3. ID sudah terbawa di dalam 'payload', jadi Backend tahu ini Edit atau Baru.

        const request$ = this.http.post<KriteriaDto>(this.apiUrl, payload);

        return await firstValueFrom(request$);
    }

    // 4. DELETE
    async delete(id: number): Promise<void> {
        const request$ = this.http.delete<void>(`${this.apiUrl}/${id}`);
        return await firstValueFrom(request$);
    }
}