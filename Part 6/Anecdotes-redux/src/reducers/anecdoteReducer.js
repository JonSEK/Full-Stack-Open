import { createSlice } from "@reduxjs/toolkit";

const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = anecdotesAtStart.map(asObject);

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    vote: {
      reducer: (state, action) => {
        const anecdote = state.find(
          (anecdote) => anecdote.id === action.payload
        );
        if (anecdote) {
          anecdote.votes += 1;
        }
      },
      prepare: (id) => {
        return { payload: id, meta: { trigger: "Vote" } };
      },
    },
    addAnecdote: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (content) => {
        return {
          payload: asObject(content),
          meta: { trigger: "New Anecdote" },
        };
      },
    },
  },
});

export const { vote, addAnecdote } = anecdoteSlice.actions;

export default anecdoteSlice.reducer;
