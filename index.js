const express = require("express");
const body_parser = require("body-parser");
const app = express().use(body_parser.json());
const axios = require("axios");
require("dotenv").config();
const token = process.env.TOKEN; // meta api token
const myToken = process.env.MY_TOKEN; // to verify the webhook

app.listen(8000 || process.env.PORT, () => {
  console.log("webhook is listening");
});

app.get("/webhook", (req, res) => {
  console.log("webhook url live");
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode === "subscribe" && token === myToken) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  } else {
    res.send(403).message("mode and token ftech error");
  }
});

app.post("/webhook", (req, res) => {
  let body_param = req.body;
  conseole.log(JSON.stringify(body_param, null, 2));
  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0] &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.message &&
      body_param.entry[0].changes[0].value.message[0]
    ) {
      let phone_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.message[0].from;
      let msg_body = body_param.entry[0].changes[0].value.message[0].text.body;
    }
    axios({
      method: "POST",
      url:
        "https://graph.facebook.com/v13.0/" +
        phone_no_id +
        "/messages?access_token=" +
        token,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: from,
        text: {
          body: "webhook test",
        },
        headers: {
          "Content-Type": "application/json",
        },
      },
    });
    res.sendStatus(200);
  } else {
    res.statusCode(404);
  }
});
