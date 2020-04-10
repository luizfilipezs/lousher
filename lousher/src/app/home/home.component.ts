import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.styl']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.postServer();
  }


	getServer(): void {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTg2NjQ4OTk5LCJlbWFpbCI6ImZpbGlwZWx1aXouYnNAZ21haWwuY29tIiwib3JpZ19pYXQiOjE1ODY0NzYxOTl9.-ij7djmsKfK0fLit1JRN5Yt4tojF9upKSdYomq9oId0';
    const apiRoot = 'http://localhost:8000/api';
    const json = response => response.json();
    const headers = new Headers({
      "Authorization": `JWT ${token}`
    });

    fetch(`${apiRoot}/enderecos`, { headers: headers })
      .then(json)
			.then(console.log);
	}

	postServer(): void {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNTg2NjQ4OTk5LCJlbWFpbCI6ImZpbGlwZWx1aXouYnNAZ21haWwuY29tIiwib3JpZ19pYXQiOjE1ODY0NzYxOTl9.-ij7djmsKfK0fLit1JRN5Yt4tojF9upKSdYomq9oId0';
    const apiRoot = 'http://localhost:8000/api';
    const json = response => response.json();
    const headers = new Headers({
      "Authorization": `JWT ${token}`
    });
		
		const body = new FormData();
		body.append('cep', '00000-000');
		body.append('bairro', 'centro');
		body.append('rua', 'Lesgal');
		body.append('numero', 70);
		body.append('complemento', 'Ap. 101');
		body.append('telefone', '(47) 9 9976-2919');
		body.append('email', 'email@email.com');
		body.append('nome_destinatario', 'Lima Barreto');

    fetch(`${apiRoot}/enderecos`, { method: 'POST', headers: headers, body: body })
      .then(json)
			.then(console.log);
	}
}
