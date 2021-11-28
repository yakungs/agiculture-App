import { USER_STATE_CHANGE,USER_FOLLOWING,USER_PLANT } from "../constants";

const initialState = {
  currentUser: {},
  following:[],
  userPlant:{}
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    case USER_FOLLOWING:
      return {
        ...state,
        following:action.following
      }
    case USER_PLANT:
      return {
        ...state,
        userPlant:action.userPlant
      }
    default:
      return state;
  }
};
