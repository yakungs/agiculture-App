import { USER_LOCATION, USER_MAP } from "../constants";

const initialState = {
  map: {},
  location: {},
};

export const map = (state = initialState, action) => {
  switch (action.type) {
    case USER_MAP:
      return {
        ...state,
        map: action.map,
      };
    case USER_LOCATION:
      console.log(action.location);
      return {
        ...state,
        location: action.location,
      };
    default:
      return state;
  }
};
