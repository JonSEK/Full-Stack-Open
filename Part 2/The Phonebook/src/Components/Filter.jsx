const Filter = ({ newFilter, handleFilter }) => {
  return (
    <>
      filter shown with <input value={newFilter} onChange={handleFilter} />
    </>
  );
};

export default Filter;
