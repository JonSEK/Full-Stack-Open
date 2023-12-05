const Persons = ({ personsToShow, toggleDeleteOf }) => {
  return (
    <ul>
      {personsToShow.map((person) => (
        <Person
          key={person.id}
          person={person}
          toggleDelete={() => toggleDeleteOf(person.id)}
        />
      ))}
    </ul>
  );
};

const Person = ({ person, toggleDelete }) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={toggleDelete}>delete</button>
    </li>
  );
};

export default Persons;
