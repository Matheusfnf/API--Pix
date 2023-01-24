if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");

const cert = fs.readFileSync(
  path.resolve(__dirname, `../certs/${process.env.GN_CERT}`)
);


const agent = new https.Agent({
  pfx: cert,
  passphrase: "",
});

const credentials = Buffer.from(
  `${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`
).toString("base64");

axios({
  method: "POST",
  url: `${process.env.GN_ENDPOINT}/oauth/token`,
  headers: {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  },
  httpsAgent: agent,
  data: {
    grant_type: "client_credentials",
  },
}).then((response) => {
  const acessToken = response.data?.acess_token;

  const endpoint = `${process.env.GN_ENDPOINT}/v2/cob`;
  const dataCob = {
    calendario: {
      expiracao: 3600
    },
    valor: {
      original: "100.00",
    },
    chave: "12990073680",
    solicitacaoPagador: "Informe o número ou identificador do pedido.",
  };
  const config = {
    httpsAgent: agent,
    headers: {
        Authorization: `Bearer ${acessToken}`,
        'Content-Type': 'application/json'
    }
  };

  axios.post(endpoint, dataCob, config).then((response) => console.log(response.data))
});
