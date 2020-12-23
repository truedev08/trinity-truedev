import axios from 'axios';
import { API_URL } from '../../config';
import { tokenConfig } from './authActions';
import {
PROFILE_CREATE_NEW,
PROFILE_CREATE_UPDATE,
PROFILE_CREATE_EDIT,
PROFILE_DELETE,
PROFILE_OBJECT,
PROFILE_GET,
USER_LOADING,
} from "./types"


export const updateProfitEstimates = (_id) => async (dispatch, getState) => {
  try {
    console.log("User ID is: ", _id);
      
    let body = {user: {id: _id}}

    const res = await axios.post(`${API_URL}/estimates/profitEstimate`, body, tokenConfig(getState))

    console.log("Result: ", res);

    dispatch({
        type: PROFILE_CREATE_UPDATE,
        payload: res.data.profitEstimate
    })

    return res


  } catch (error) {
        console.log(error.message)
        return error.message
  }
}