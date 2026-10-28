import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

describe("App", () => {
  it("renders the application without crashing", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(document.body).toBeTruthy();
  });

  it("renders the course manager section", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(document.querySelector("#course-manager")).toBeInTheDocument();
  });
});
