const express = require("express");
const Joi = require("joi");
const morgan = require("morgan");
const contacts = require("./contacts");
const cors=require('cors');
const ALLOWED_ACESS='http://port:55928'
const PORT = 3001;
const server = express();

server.use(express.json());
server.use(express.static("public"));
server.use(morgan("dev"));
server.use(cors({origin:ALLOWED_ACESS}))

server.get("/", function (req, res) {
  res.send("hello, world!");
});
server.get("/api/contacts", (req, res, next) => {
  return contacts.listContacts(req, res);

});

server.get("/api/contacts/:id", (req, res, next) => {
  return contacts.getContactById(req, res, req.params.id);
});
server.delete("/api/contacts/:id", (req, res, next) => {
  return contacts.removeContact(req, res, req.params.id);
});
server.post(
  "/api/contacts",
  (req, res, next) => {
    const validationContact = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const validationResult = Joi.validate(req.body, validationContact);
    if (validationResult.error) {
      res.status(400).send(validationResult.error.details[0].message);
    } else {
      next();
    }
  },
  (req, res) => {
    contacts.addContact(req.body, res);
  }
);

{
}
server.patch(
  "/api/contacts/:contactId",
  (req, res, next) => {
    const validationContact = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });
    const validationResult = Joi.validate(req.body, validationContact);
    if (validationResult.error) {
      resp.status(400).send(validationResult.error.details[0].message);
    } else {
      next();
    }
  },
  (req, res) => {
    const id = req.params.contactId;
    console.log("req.body", req.body);
    return contacts.updateContact(req.body, res, id);
  }
);
server.listen(PORT, () => {
  console.log("Server is now started on port: ", PORT);
});
