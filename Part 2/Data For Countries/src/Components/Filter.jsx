const Filter = ({ newFilter, handleFilter }) => {
  return (
    <>
      find countries <input value={newFilter} onChange={handleFilter} />
    </>
  );
};

export default Filter;
