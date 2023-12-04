const Course = ({ course, parts }) => {
  const totalExercises = parts.reduce(
    (sum, currentPart) => sum + currentPart.exercises,
    0
  );
  return (
    <>
      <Header course={course} />
      <Content part={parts} />
      <Total sum={totalExercises} />
    </>
  );
};

const Header = ({ course }) => <h2>{course}</h2>;

const Content = ({ part }) => (
  <>
    {part.map((part, id) => (
      <Part key={id} part={part} />
    ))}
  </>
);

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Total = ({ sum }) => (
  <p>
    <strong>total of {sum} exercises</strong>
  </p>
);

export default Course;
