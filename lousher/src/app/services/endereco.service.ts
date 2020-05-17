import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endereco } from '../endereco';

@Injectable()
export class EnderecoService {

  apiRoot = 'http://localhost:8000/api/enderecos/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  setAuth(token: string) {
    this.httpOptions.headers.append('Authorization', `JWT ${token}`);
  }

  getEnderecos(): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(this.apiRoot, this.httpOptions);
  }

  getEnderecoById(id: number): Observable<Endereco> {
    return this.http.get<Endereco>(this.apiRoot.concat(`${id}/`), this.httpOptions);
  }

  postEndereco(endereco: Endereco): Observable<Endereco> {
    return this.http.post<Endereco>(this.apiRoot, endereco, this.httpOptions);
  }

  updateEndereco(id:number, endereco: Endereco): Observable<Endereco> {
    return this.http.put<Endereco>(this.apiRoot.concat(`${id}/`), endereco, this.httpOptions);
  }

  deleteEndereco(id: number): Observable<{}> {
    return this.http.delete(this.apiRoot.concat(`${id}/`), this.httpOptions);
  }
}
