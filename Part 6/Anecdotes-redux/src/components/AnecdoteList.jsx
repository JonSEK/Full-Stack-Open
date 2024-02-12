import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotificationWithTimeout } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes);
  const filter = useSelector((state) => state.filter);
  const dispatch = useDispatch();

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote));
    dispatch(setNotificationWithTimeout(`You voted '${anecdote.content}'`, 5));
  };

  const filteredAnecdotes = anecdotes.filter(
    (anecdote) =>
      typeof anecdote.content === "string" &&
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      {filteredAnecdotes
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
