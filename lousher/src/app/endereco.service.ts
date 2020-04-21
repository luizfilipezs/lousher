import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endereco } from './endereco';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTg2NzM3MjY3LCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsIm9yaWdfaWF0IjoxNTg2NTY0NDY3fQ.KOmwnSE8p2mtu0gVB1FTevh-8_YIr_YR9dgELKX9EZs'
  })
};

@Injectable()
export class EnderecoService {

  apiRoot = 'http://localhost:8000/api/enderecos/';

  constructor(private http: HttpClient) { }

  getEnderecos(): Observable<Array<Endereco>> {
    return this.http.get<Array<Endereco>>(this.apiRoot, httpOptions);
  }

  getEnderecoById(id: number): Observable<Endereco> {
    return this.http.get<Endereco>(this.apiRoot.concat(`${id}/`), httpOptions);
  }

  postEndereco(endereco: Endereco): Observable<Endereco> {
    return this.http.post<Endereco>(this.apiRoot, endereco, httpOptions);
  }

  updateEndereco(id:number, endereco: Endereco): Observable<Endereco> {
    return this.http.put<Endereco>(this.apiRoot.concat(`${id}/`), endereco, httpOptions);
  }

  deleteEndereco(id: number): Observable<{}> {
    return this.http.delete(this.apiRoot.concat(id.toString()), httpOptions);
  }
}
