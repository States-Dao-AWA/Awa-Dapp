import "regenerator-runtime/runtime";
import React from "react";

import "./assets/css/global.css";
import cozaLogo from "./assets/img/cozaLogo2.jpg";

import { login, logout } from "./assets/js/near/utils";
import { postGuess } from "./apis/guess";

export default function App() {
  const [number, setNumber] = React.useState(0);
  const [balance, setBalance] = React.useState(0);

  React.useEffect(async () => {
    if (window.walletConnection.isSignedIn()) {
      const balance = await window.contract.ft_balance_of({
        account_id: window.accountId,
      });
      setBalance(balance / 10000);
    }
  }, []);

  const handleChange = async (event) => {
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
      const { message } = await postGuess({
        answer: number,
        address: window.accountId,
      });
      if (message === "not the first time") {
        return alert("Sorry! You aleady done!");
      }

      if (message === "up") {
        return alert("Sorry! You guessed wrong!(UP!)");
      }

      if (message === "down") {
        return alert("Sorry! You guessed wrong!(DOWN!)");
      }
      setBalance(balance + 5);
      return alert("Congratulations! You guessed correctly.");
    } catch (err) {
      console.log(err, "Fail to request");
    }
  };

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <img
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "2.5rem",
            width: "50%",
          }}
          src={cozaLogo}
          alt="cozaLogo"
        />
        <h1>
          <span style={{ color: "#82EB5A" }}>COzA</span> is a dApp for raising
          awareness, <br />
          for crypto and carbon emissions, <br />
          through a viral guessing game of how much crypto{" "}
          <span style={{ color: "#82EB5A" }}>
            projects are reducing emissions.
          </span>
          <br /> Guess-to-Earn. AWA Token!
        </h1>
        <p style={{ textAlign: "center", marginTop: "1.5em" }}>
          <button onClick={login}>Let's get started</button>
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
        <br />
        <h2>
          Hey!! <span style={{ color: "#82EB5A" }}>{window.accountId}!</span>{" "}
        </h2>
        <h3>
          Guess how much Co2 is saved by crypto protocols! <br />
          If you guess right,{" "}
          <span style={{ color: "#82EB5A" }}>you earn AWA Token</span>(Awareness
          Token)!!
        </h3>
        <form onSubmit={handleSubmit}>
          <label>
            StepN: <br />
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
            DreamN: <br />
            <input type="number" name="guess" min="0" max="10000" disabled />
          </label>
          <button type="submit" disabled>
            Guess
          </button>
        </form>
        <form>
          <label>
            StatesDAO: <br />
            <input type="number" name="guess" min="0" max="10000" disabled />
          </label>
          <button type="submit" disabled>
            Guess
          </button>
        </form>
        <br />
      </main>
      <div
        style={{
          width: "100%",
          height: "20px",
          backgroundColor: "white",
        }}></div>
      <h2>My AWA Token Balance: {balance}</h2>
    </>
  );
}
