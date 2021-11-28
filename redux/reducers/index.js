import { combineReducers } from "redux";
import { user } from "./user";
import { users } from "./users";
import { plant } from "./plant";
import { map } from "./map";
import { location } from "./location";

const Reducers = combineReducers({
  userState: user,
  usersState: users,
  plantState: plant,
  userMapState: map,
  userLocationState: location,
});

export default Reducers;
