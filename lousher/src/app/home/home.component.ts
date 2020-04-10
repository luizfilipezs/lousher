import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Endereco } from '../endereco';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTg2NzI3NzM2LCJlbWFpbCI6ImZpbGlwZWx1aXouYnNAZ21haWwuY29tIiwib3JpZ19pYXQiOjE1ODY1NTQ5MzZ9.qf5IG8nDSFRS_CCrerfaMSPLGHwq2yj9tkDbw8FPyoc'
  })
};

const apiRoot = 'http://localhost:8000/api';
const json = response => response.json();

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //this.getServer();
  }
  
	getServer(): void {
    this.http.get(apiRoot.concat('/enderecos'), httpOptions)
      .subscribe(
        (success) => console.log('SUCCESS: ', success),
        (error) => console.log('ERROR: ', error)
      );
	}

	postServer(): void {
    /*
    const endereco: Endereco = {
      cep: '00000-000',
  		bairro: 'Centro',
  		rua: 'Lesgal',
  		numero: 70,
  		complemento: 'Ap. 101',
  		telefone: '(47) 9 9976-2919',
  		email: 'email@email.com',
  		nomeDestinatario: 'Lima Barreto'
    }
    
    this.http.post<Endereco>(apiRoot.concat('/enderecos'), endereco, httpOptions)
      .subscribe(
        (success) => console.log('SUCCESS: ', success),
        (error) => console.log('ERROR: ', error)
      );
    */
	}
}
