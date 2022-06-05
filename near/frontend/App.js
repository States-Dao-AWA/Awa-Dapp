import "regenerator-runtime/runtime";
import React from "react";

import "./assets/css/global.css";
import cozaLogo from "./assets/img/cozA.jpg";

import { login, logout } from "./assets/js/near/utils";
import { postGuess } from "./apis/guess";

export default function App() {
  const [number, setNumber] = React.useState(0);
  const [address, serAddress] = React.useState(window.accountId);

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
      const balance = await window.contract.ft_balance_of({
        account_id: window.accountId,
      });
      if (+balance === 0) {
        await window.contract.storage_deposit({
          args: {},
          amount: "1250000000000000000000",
        });
      }

      const { message } = await postGuess({ answer: number, address });
      if (message === "not the first time") {
        return alert("Sorry! You aleady done!");
      }

      if (message === "up") {
        return alert("Sorry! You guessed wrong!(UP!)");
      }

      if (message === "down") {
        return alert("Sorry! You guessed wrong!(DOWN!)");
      }

      return alert("Congratulations! You guessed correctly.");
    } catch (err) {
      console.log(err, "Fail to request");
    }
  };

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <img src={cozaLogo} alt="cozaLogo" />
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
