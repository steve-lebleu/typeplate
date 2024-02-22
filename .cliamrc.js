require('dotenv').config();
module.exports = {
  sandbox: true,
  variables: {
    domain: "https://wwww.example.com",
    addresses: {
      from: {
        name: "YOUR_FROM_NAME",
        email: "info@example.com"
      },
      replyTo: {
        name: "YOUR_REPLY_TO_NAME",
        email: "test@example.be"
      }
    }
  },
  transporters: [
    {
      id: 'smtp-transporter',
      mode: 'smtp',
      auth: {
        username: "noemie2@ethereal.email",
        password: "5cDumYP68aFcpT15uV"
      },
      options: {
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
      }
    }
  ]
};