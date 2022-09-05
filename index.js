const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId =
    contacts.length > 0 ? Math.max(...contacts.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.use(cors());
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData"
  )
);

morgan.token("postData", (request, response) => {
  return JSON.stringify(request.body);
});

app.post("/api/contacts", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Both name and number are required",
    });
  }

  if (contacts.find((el) => el.name === body.name)) {
    return res.status(400).json({
      error: "Name must be unique",
    });
  }

  const contact = {
    id: generateId(),
    name: body.name,
    number: body.number || "",
  };

  contacts = contacts.concat(contact);
  res.json(contact);
});

app.get("/info", (req, res) => {
  const date = new Date();

  res.send(`
    <div>
    <p>Phonebook has info for ${contacts.length} people</p>
    <p>${date}</p>
    </div> 
    `);
});

app.get("/api/contacts", (req, res) => {
  res.json(contacts);
});

app.get("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  const contact = contacts.find((contact) => contact.id === id);

  if (contact) {
    res.json(contact);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  contacts = contacts.filter((contact) => contact.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
