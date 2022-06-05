import axios from "axios";
import { DOMAIN } from "../assets/js/near/utils";

const URL = `${DOMAIN}/guess`;

/**
 * Send a post request to the api server.
 * @returns response
 */
export async function postGuess(body) {
  try {
    const res = await axios.post(URL, JSON.stringify(body), {
      headers: {
        "Content-Type": `application/json`,
      },
    });

    return res.data.result;
  } catch (error) {
    throw new Error(error);
  }
}
