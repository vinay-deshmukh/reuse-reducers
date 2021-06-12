import { render } from "react-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import App from "./App";
import { loadData } from "./redux/pageOneSlice";

const rootElement = document.getElementById("root");
render(
  <Provider store={store}>
    <App />
  </Provider>,

  rootElement
);

setTimeout(() => {
  store.dispatch(loadData());
}, 2000);
