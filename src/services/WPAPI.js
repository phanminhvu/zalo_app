/**
 * Created by InspireUI on 13/06/2017.
 *
 * @format
 */

import WPAPI from "wpapi";
import {REST_API_URL} from "../utils/constants";
const wpAPI = new WPAPI({
  endpoint: `${REST_API_URL}`,
});

export default wpAPI;
