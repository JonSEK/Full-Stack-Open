import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setNotification: (state, action) => action.payload,
    clearNotification: () => null,
  },
});

export const setNotificationWithTimeout = (content, seconds) => {
  return async (dispatch) => {
    dispatch(setNotification(content));
    setTimeout(() => {
      dispatch(clearNotification());
    }, seconds * 1000);
  };
};

export const { setNotification, clearNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
