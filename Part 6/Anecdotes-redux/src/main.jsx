import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./reducers/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
