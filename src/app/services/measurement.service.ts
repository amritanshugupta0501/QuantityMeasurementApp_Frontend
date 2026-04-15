import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface QuantityDTO {
  value: number;
  unit: string;
  measurementType: string;
}

export interface QuantityInputDTO {
  thisQuantityDTO: QuantityDTO;
  thatQuantityDTO: QuantityDTO;
}

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private http = inject(HttpClient);

  private getHeaders() {
    const token = localStorage.getItem('jwtToken');
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  add(data: QuantityInputDTO) {
    return this.http.post<any>('/api/v1/quantities/add', data, { headers: this.getHeaders() });
  }

  compare(data: QuantityInputDTO) {
    return this.http.post<any>('/api/v1/quantities/compare', data, { headers: this.getHeaders() });
  }

  convert(data: QuantityInputDTO) {
    return this.http.post<any>('/api/v1/quantities/convert', data, { headers: this.getHeaders() });
  }

  subtract(data: QuantityInputDTO) {
    return this.http.post<any>('/api/v1/quantities/subtract', data, { headers: this.getHeaders() });
  }

  divide(data: QuantityInputDTO) {
    return this.http.post<any>('/api/v1/quantities/divide', data, { headers: this.getHeaders() });
  }

  getHistoryByType(type: string) {
    return this.http.get<any>(`/api/v1/quantities/history/type/${type}`, { headers: this.getHeaders() });
  }

  getHistoryByOperation(operation: string) {
    return this.http.get<any>(`/api/v1/quantities/history/operation/${operation}`, { headers: this.getHeaders() });
  }
}
