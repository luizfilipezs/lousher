import email, smtplib, ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from decouple import config
from .models import Pedido, User, MensagemContato

class _Email(object):
    __remetente = 'vinhoslouscher@hotmail.com'
    __password = config('EMAIL_PASSWORD')

    def __init__(self, destinatario: str, assunto: str, mensagem: str):
        self.destinatario = destinatario
        self.assunto = assunto
        # Conteúdo HTML
        self.corpo = """
        <html>
            <body>
                """ + mensagem + """
            </body>
        </html>
        """

    def __enviar(self) -> None:
        mensagem = MIMEMultipart()
        mensagem['From'] = self.__remetente
        mensagem['To'] = self.destinatario
        mensagem['Subject'] = self.assunto
        # Add body to email
        mensagem.attach(MIMEText(self.corpo, 'html')) # plain for text, html for html
        # Log in to server using secure context and send email
        self.__usar_tls(mensagem)

    def __usar_ssl(self, mensagem) -> None:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as server:
            server.login(self.__remetente, self.__password)
            server.sendmail(self.__remetente, self.destinatario, mensagem.as_string())

    def __usar_tls(self, mensagem) -> None:
        mailserver = smtplib.SMTP('smtp-mail.outlook.com', 587)
        mailserver.ehlo()
        mailserver.starttls()
        mailserver.ehlo()
        mailserver.login(self.__remetente, self.__password)
        mailserver.sendmail(self.__remetente, self.destinatario, mensagem.as_string())
        mailserver.quit()

    def __del__(self):
        self.__enviar()

class EnviarEmail(object):

    @staticmethod
    def atualizacao_status_pedido(usuario_id: int, pedido_id: int, mensagem_adicional="") -> None:
        usuario = User.objects.get(pk=usuario_id)
        pedido = Pedido.objects.get(pk=pedido_id)

        mensagem = f"""
        <p>Olá, {usuario.username}!</p>
        <p>O status do seu pedido foi atualizado. Veja:</p>
        <div style="margin: 20px">
            <p><strong>ID:</strong> {pedido.id}</p>
            <p><strong>Status do pedido:</strong> {pedido.get_status_display()}</p>
        </div>
        <p>{mensagem_adicional}</p>
        <p>Se tiver qualquer dúvida, responda este email e entraremos em contato com você o quanto antes ;)</p>
        <p>Atenciosamente,<br>Equipe Louscher</p>
        """

        _Email(usuario.email, 'O status do seu pedido foi atualizado', mensagem)

    @staticmethod
    def responder_mensagem(mensagem_id: int, resposta: str):
        mensagem_contato = MensagemContato.objects.get(pk=mensagem_id)

        mensagem = f"""
        <p>Olá, {mensagem_contato.nome}!</p>
        <p>Recebemos sua mensagem:</p>
        <p style="margin: 20px; font-style: italic;">{mensagem_contato.mensagem}</p>
        <p>Nos esforçamos para responder todas as mensagens que recebemos o mais breve possível. Por isso, não poderíamos deixar de responder a sua também:</p>
        <p style="margin: 20px; font-style: italic;">{resposta}</p>
        <p>Podemos te ajudar mais? Agora você já sabe o nosso email, então não hesite em falar conosco ;)</p>
        <p>Atenciosamente,<br>Equipe Louscher</p>
        """

        _Email(mensagem_contato.email, f"Recebemos sua mensagem, {mensagem_contato.nome} :)", mensagem)