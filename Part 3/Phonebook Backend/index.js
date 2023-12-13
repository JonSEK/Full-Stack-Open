const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(cors());

morgan.token("requestData", (req) => {
  const { name, number } = req.body;
  return `{Name: ${name}, Number: ${number}}`;
});

let persons = [
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

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const id = Math.floor(Math.random() * 10000000000);
  return id;
};

app.post(
  "/api/persons",
  morgan(":method :url :status - :response-time ms - :requestData"),
  (request, response) => {
    const body = request.body;
    if (!body.name || !body.number) {
      return response.status(400).json({
        error: "name or number is missing",
      });
    }

    const nameExists = persons.some((person) => person.name === body.name);
    if (nameExists) {
      return response.status(400).json({
        error: "Name must be unique.",
      });
    }

    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };

    persons = persons.concat(person);

    response.json(person);
  }
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});