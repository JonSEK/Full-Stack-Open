import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload;
      const anecdoteToVote = state.find((anecdote) => anecdote.id === id);
      if (anecdoteToVote) {
        anecdoteToVote.votes += 1;
      }
    },
    addAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      state.length = 0;
      state.push(...action.payload);
    },
  },
});

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    anecdotes.forEach((anecdote) => {
      if (!anecdote.id) {
        console.error(
          `An anecdote does not have an id property: ${JSON.stringify(
            anecdote
          )}`
        );
      }
    });
    dispatch(anecdoteSlice.actions.setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    if (!newAnecdote.id) {
      console.error("The new anecdote does not have an id property");
      return;
    }
    dispatch(anecdoteSlice.actions.addAnecdote(newAnecdote));
  };
};

export const voteAnecdote = (anecdote) => {
  if (!anecdote.id) {
    console.error("The anecdote does not have an id property");
    return;
  }
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.update(anecdote.id, {
      ...anecdote,
      votes: anecdote.votes + 1,
    });
    dispatch(anecdoteSlice.actions.vote(updatedAnecdote.id));
  };
};

export const { vote, addAnecdote, setAnecdotes } = anecdoteSlice.actions;

export default anecdoteSlice.reducer;
