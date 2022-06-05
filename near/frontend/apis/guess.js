import axios from "axios";
import { DOMAIN } from "../assets/js/near/utils";

const URL = `${DOMAIN}/guess`;

/**
 * Send a post request to the api server.
 * @returns response
 */
export async function postGuess(body) {
  try {
    const res = await axios({
      method: "post",
      url: URL,
      headers: {
        accept: "application/json",
      },
      data: JSON.stringify(body),
    });

    return res.data;
  } catch (error) {
    return error.response.data;
  }
}
