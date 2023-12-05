const CountryForm = ({ newName, handleNameChange }) => {
  return (
    <form>
      <div>
        find countries <input value={newName} onChange={handleNameChange} />
      </div>
    </form>
  );
};

export default CountryForm;
