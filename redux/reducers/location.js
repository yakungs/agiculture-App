import { USER_LOCATION, USER_MAP } from "../constants";

const initialState = {
  location: {},
};

export const location = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOCATION:
      return {
        ...state,
        location: action.location,
      };
    default:
      return state;
  }
};
