import "regenerator-runtime/runtime";
import React from "react";

import "./assets/css/global.css";

import { login, logout } from "./assets/js/near/utils";
import { postGuess } from "./apis/guess";

export default function App() {
  const [number, setNumber] = React.useState(0);

  const handleChange = (event) => {
    const { valueAsNumber, min, max } = event.target;
    if (valueAsNumber < +min) {
      alert("Min value reached");
      setNumber(+min);
      return;
    }
    if (valueAsNumber >= +max) {
      alert("Max value reached");
      setNumber(+max);
      return;
    }
    setNumber(valueAsNumber);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await postGuess(number);
    } catch (err) {
      console.log("Fail to request");
    }
  };

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Crypto projects are reducing XXX amount of CO2 emmision / day</h1>
        <p style={{ textAlign: "center", marginTop: "2.5em" }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    );
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <button className="link" style={{ float: "right" }} onClick={logout}>
        Sign out
      </button>
      <main>
        <h1>
          {
            " " /* React trims whitespace around tags; insert literal space character when needed */
          }
          Hey!! {window.accountId}!
        </h1>
        <form onSubmit={handleSubmit}>
          <label>
            Stepn:
            <input
              type="number"
              name="stepn-guess"
              min="0"
              max="10000"
              onChange={handleChange}
              value={number}
            />
          </label>
          <button type="submit">Guess</button>
        </form>
        <form>
          <label>
            Something:
            <input type="number" name="guess" min="0" max="10000" disabled />
          </label>
          <button type="submit" disabled>
            Guess
          </button>
        </form>
        <form>
          <label>
            Something2:
            <input type="number" name="guess" min="0" max="10000" disabled />
          </label>
          <button type="submit" disabled>
            Guess
          </button>
        </form>
        <br />
      </main>
    </>
  );
}
