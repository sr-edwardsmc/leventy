interface getPDFTicketInput {
  logoImage: string;
  qrCode: string;
  name: string;
  lastName: string;
  idNumber: string;
}

export const getPDFHtmlContent = (args: getPDFTicketInput): string => {
  const { logoImage, qrCode, name, lastName, idNumber } = args;
  const htmlContent = `
    <html>
      <head>
        <style>
          html {
            -webkit-print-color-adjust: exact;
          }
          body {
            font-family: "Open Sans", sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            width: 100vw;
            height: 100vh;
            display: flex;
            overflow: hidden;
            background: black;
          }
          .header {
            margin: 0 auto;
            text-align: center;
            margin-bottom: 20px;
          }
          .header img {
            flex: 1;
            width: 200px;
            height: 200px;
            border-radius: 50%;
          }
          .header h1 {
            align-self: center;
          }
          .body {
            position: relative;
            width: 100vw;
            height: 100vh;
            background: black;
          }
          .body img.flyer-logo {
            position: absolute;
            width: 100%;
            height: 100%;
          }
          .ticket {
            padding: 10px;
            border: 1px solid #ccc;
            background: white;
            border-radius: 5px;
            position: absolute;
            right: 5%;
            top: 30%;
            text-align: right;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-weight: bold;
          }
          .ticket h1 {
            text-align: left;
          }
          .ticket img {
            display: block;
            margin: 0;
            width: 250px;
            height: 200px;
          }
          .ticket p {
            font-size: 16px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <section class="body">
          <img class="flyer-logo" src="data:image/png;base64,${logoImage}" alt="Flyer" />
          <div class="ticket">
            <img src="${qrCode}" alt="QR Code" />
            <div>
              <p>Nombre: ${name} ${lastName}</p>
              <p>Identificación: ${idNumber}</p>
            </div>
          </div>
        </section>
      </body>
    </html>
  `;

  return htmlContent;
};
