import { USERS_POSTS_DATA } from "../constants";

const initialState = {
  usersData: [],
};

export const users = (state = initialState, action) => {
  switch (action.type) {
    case USERS_POSTS_DATA:
      return {
        ...state,
        usersData: [...state.usersData, action.usersData],
      };
    default:
      return state;
  }
};
