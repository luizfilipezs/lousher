import email, smtplib, ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from decouple import config

class Email(object):
    __remetente = 'vinhoslouscher@hotmail.com'
    __password = config('EMAIL_PASSWORD')

    def __init__(self, destinatario: str, assunto: str, mensagem: str):
        self.destinatario = destinatario
        self.assunto = assunto
        # Conteúdo HTML
        self.corpo = """
        <html></html>
        """

    def __enviar(self) -> None:
        mensagem = MIMEMultipart()
        mensagem['From'] = self.__remetente
        mensagem['To'] = self.destinatario
        mensagem['Subject'] = self.assunto
        # Add body to email
        mensagem.attach(MIMEText(self.corpo, 'html')) # plain for text, html for html
        # Log in to server using secure context and send email
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL('email-ssl.com.br', 465, context=context) as server:
            server.login(self.__remetente, self.__password)
            server.sendmail(self.__remetente, self.destinatario, mensagem.as_string())

    def __del__(self):
        self.__enviar()