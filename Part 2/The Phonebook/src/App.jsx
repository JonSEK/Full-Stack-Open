import React, { useState, useEffect } from "react";
import Persons from "./Components/Persons";
import PersonForm from "./Components/PersonForm";
import Filter from "./Components/Filter";
import personService from "./Services/persons";
import Notification from "./Components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const toggleDeleteOf = async (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      try {
        await personService.deleteEntry(id);
        setPersons(persons.filter((person) => person.id !== id));
        setErrorMessage(`Deleted ${personToDelete.name}`);
        setTimeout(() => setErrorMessage(null), 5000);
      } catch (error) {
        setErrorMessage(
          `Information of ${personToDelete.name} has already been removed from the server`
        );
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  useEffect(() => {
    const fetchPersons = async () => {
      const initialPersons = await personService.getAll();
      setPersons(initialPersons);
    };

    fetchPersons();
  }, []);

  const addName = async (event) => {
    event.preventDefault();

    const personObject = { name: newName, number: newNumber };

    const nameExists = persons.find((person) => person.name === newName);

    if (nameExists) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        try {
          const returnedPerson = await personService.update(
            nameExists.id,
            personObject
          );
          setPersons(
            persons.map((p) => (p.id !== nameExists.id ? p : returnedPerson))
          );
          setErrorMessage(`Updated ${newName}`);
          setTimeout(() => setErrorMessage(null), 5000);
          setNewName("");
          setNewNumber("");
        } catch (error) {
          setErrorMessage(
            `Information of ${newName} has already been removed from the server`
          );
          setTimeout(() => setErrorMessage(null), 5000);
        }
      }
    } else {
      try {
        const returnedPerson = await personService.create(personObject);
        setPersons([...persons, returnedPerson]);
        setErrorMessage(`Added ${newName}`);
        setTimeout(() => setErrorMessage(null), 5000);
        setNewName("");
        setNewNumber("");
      } catch (error) {
        // Handle error if needed
        console.error("Error adding a new person:", error);
      }
    }
  };

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilter = (event) => setNewFilter(event.target.value);

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  return (
    <div>
      <Notification message={errorMessage} />
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilter={handleFilter} />
      <h3>add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} toggleDeleteOf={toggleDeleteOf} />
    </div>
  );
};

export default App;
