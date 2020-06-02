const fs = require("fs");
const { promises: fsPromises } = fs;
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");
const fileReader = async () => {
  return await fsPromises.readFile(
    contactsPath,
    {
      encoding: "utf-8",
    },
    (err, data) => {
      try {
        return data;
      } catch (err) {
        console.log("err", err);
      }
    }
  );
};
function randomId(min = 0, max = 99) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
async function listContacts(req, res) {
  fileReader().then((data) => res.send(data));
}

function getContactById(req, res, id) {
  fileReader().then((data) => {
    try {
      const parsedData = JSON.parse(data);
      const getById = parsedData.find((elem) => elem.id.toString() === id);
      if (getById) {
        res.send(getById);
      } else {
        res.status(404).send({ message: "Not found" });
      }
    } catch (err) {
      console.log("err", err);
    }
  });
}

function removeContact(req, res, id) {
  fileReader().then((data) => {
    try {
      const parsedData = JSON.parse(data);
      const getById = parsedData.find((elem) => elem.id.toString() === id);
      if (!getById) {
        res.status(404).send({ message: "Not found" });
      } else {
        const deleteContact = parsedData.filter(
          (item) => item.id.toString() !== id
        );

        res.status(200).send({ message: `removed contact` });
        fs.writeFile(contactsPath, JSON.stringify(deleteContact), () => {});
      }
    } catch (error) {
      console.log(" error:", err);
    }
  });
}

async function addContact({ name, email, phone }, res) {
  fileReader().then((data) => {
    try {
      const parsedData = JSON.parse(data);
      newContact = { id: randomId(), name, email, phone };
      console.log("newContact", newContact);
      addContactData = [...parsedData, newContact];

      fsPromises
        .writeFile(contactsPath, JSON.stringify(addContactData), () => {})
        .then(res.status(201).send({ message: "Contact created" }));
    } catch (error) {
      resp.send(err);
    }
  });
}
function updateContact(req, res, id) {
  fileReader().then((data) => {
    try {
      const parsedData = JSON.parse(data);
      const contact = parsedData.findIndex((item) => {
        return item.id.toString() === id;
      });

      if (contact === -1) {
        res.status(404).send({ message: "contact not found" });
      } else {
        console.log("req.body", req);
        console.log("parsedData[contact]", parsedData[contact]);
        Object.assign(parsedData[contact], { ...req });

        fsPromises
          .writeFile(contactsPath, JSON.stringify(parsedData, null, 2))
          .then(() => {
            res.send(parsedData[contact]);
          });
      }
    } catch (error) {
      res.send(err);
    }
  });
}

module.exports = {
  listContacts,
  addContact,
  removeContact,
  getContactById,
  updateContact,
};
