const nodemailer = require("nodemailer");

class EmailManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "marcuccisantiago8@gmail.com",
        pass: "jwoc mqgm befc fgwr",
      },
    });
  }

  async enviarCorreoCompra(email, first_name, ticket) {
    try {
      const mailOptions = {
        from: "Coder Test <marcuccisantiago8@gmail.com>",
        to: email,
        subject: "Confirmación de compra",
        html: `
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu compra, ${first_name}!</p>
                    <p>El número de tu orden es: ${ticket}</p>
                `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
    }
  }

  async sendCorreoRestablecimiento(email, first_name, token) {
    try {
      const mailOptions = {
        from: "Coder Test <marcuccisantiago8@gmail.com>",
        to: email,
        subject: "Restablencimiento de contraseña",
        html: `
                    <h1>Restableciemiento de contraseña</h1>
                    <p>¡Hola ${first_name}!</p>
                    <p>Restableciste tu contraseña te pasamos el codigo de confirmacion</p>
                    <strong>${token} </strong>
                    <p>El codigo expira en una hora, si no lo pediste ignora este mensaje.</p>
                    <a href="http://localhost:8080/password"> Restablecer contrasela </a>
                `,
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error al enviar el email", error);
    }
  }
}

module.exports = EmailManager;
