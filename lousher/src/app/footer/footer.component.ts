import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RequestParser } from 'http-service-ts';
import { MensagemContato } from '../mensagem.contato';
import { APIRoot } from '../api.root';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.styl']
})
export class FooterComponent implements OnInit {

  contactForm: FormGroup;

  private http: RequestParser;

  messageState = 'Enviar';

  constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      nome: '',
      email: '',
      assunto: '',
      mensagem: ''
    });
  }

  ngOnInit() {
    this.http = new RequestParser(APIRoot.api, {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      appendSlash: false
    });
  }

  /**
   * Check contact form validations and send message to server.
   * @param {MensagemContato} data Message object.
   */
  onSubmit(data: MensagemContato) {
    if (this.contactForm.valid) {
      this.messageState = 'Enviando...';

      this.http.request<MensagemContato>({
        url: 'enviarMensagem',
        method: 'post',
        obj: data
      })
        .then((sucess) => {
          this.messageState = 'Enviado!';
          setTimeout(() => this.messageState = 'Enviar', 2500);
          this.contactForm.reset();
        })
        .catch((reason) => this.messageState = 'Tentar novamente');

    } else {
      this.messageState = 'Preencha os campos!';
    }
  }

}
