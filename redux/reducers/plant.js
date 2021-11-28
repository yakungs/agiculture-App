import {PLANT_DATA} from "../constants";

const initialState = {
    plants:[]
};

export const plant = (state = initialState, action) => {
  switch (action.type) {
    case PLANT_DATA:
      return {
        ...state,
        plants: action.plants,
      };
    default:
      return state;
  }
};