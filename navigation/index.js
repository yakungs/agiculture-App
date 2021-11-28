import "react-native-gesture-handler";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../screens/authentication/HomeScreen";
import ForgetScreen from "../screens/authentication/ForgetScreen";

import RegisterScreen from "../screens/authentication/RegisterScreen";
import SuccessScreen from "../screens/authentication/SuccessScreen";
import LoginScreen from "../screens/authentication/LoginScreen";
import FormInputScreen from "../screens/begin/FormInputScreen";
import SelectModelScreen from "../screens/begin/SelectModelScreen";
import CustomizeScreen from "../screens/begin/CustomizeScreen";
import ResultingScreen from "../screens/begin/ResultingScreen";
import MainScreen from "../screens/main/index";
import ProfileScreen from "../screens/user/ProfileScreen";
import FavouriteScreen from "../screens/favourite/FavouriteScreen";
import FeedScreen from "../screens/agriculture/FeedScreen";
import PlantListScreen from "../screens/agriculture/PlantListScreen";
import PlantDetailScreen from "../screens/agriculture/PlantDetailScreen";
import ModelScreen from "../screens/agriculture/ModelScreen";
import ModelDetailScreen from "../screens/agriculture/ModelDetailScreen";

import ChoiceScreen from "../screens/begin/ChoiceScreen";
import WaterScreen from "../screens/agriculture/WaterScreen";
import AreaScreen from "../screens/begin/AreaScreen";
import MapScreen from "../screens/map/MapScreen";
import SetGridScreen from "../screens/map/SetGridScreen";
import ConfirmScreen from "../screens/map/ConfirmScreen";
import DevideAreaScreen from "../screens/map/DevideAreaScreen";
import ChooseCropScreen from "../screens/map/ChooseCropScreen";
import AnotherProfileScreen from "../screens/user/AnotherProfileScreen";
import UserPlantScreen from "../screens/user/UserPlantScreen";
import UserAreaScreen from "../screens/user/UserAreaScreen";
import SettingMapScreen from "../screens/begin/SettingMapScreen";
import PlantingMapScreen from "../screens/map/PlantingMapScreen";
import FormScreen from "../screens/begin/FormScreen";
import OwnerLandScreen from "../screens/map/OwnerLandScreen";
import AnotherPost from "../screens/user/AnotherPost";
//sidebar
import SideBar from "../screens/sidebar/SideBar";
import { Image } from "react-native";

// redux
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "../redux/reducers/index";
import thunk from "redux-thunk";
import { connect } from "react-redux";

//loading
import { Root } from "native-base";
import AppLoading from "expo-app-loading";

//firebase
import * as firebase from "firebase";
import SearchMap from "../screens/begin/SearchMap";
import { TouchableOpacity } from "react-native-gesture-handler";

//redux store
const store = createStore(rootReducer, applyMiddleware(thunk));

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation(colorScheme) {
  const [loaded, setLoaded] = React.useState({
    loading: false,
  });

  React.useEffect(() => {
    var didCancel = false;
    if (!didCancel) {
      firebase.auth().onAuthStateChanged((user) => {
        console.log(user);
        if (!user) {
          setLoaded({
            loggedIn: false,
            loading: true,
          });
        } else {
          setLoaded({
            loggedIn: true,
            loading: true,
          });
        }
      });
    }
    return () => (didCancel = true);
  }, []);
  if (!loaded.loading) {
    return (
      <Root>
        <AppLoading />
      </Root>
    );
  }
  if (!loaded.loggedIn) {
    return (
      <NavigationContainer
        // linking={LinkingConfiguration}
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <RootNavigator />
      </NavigationContainer>
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer
        theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <DrawerNavigator />
      </NavigationContainer>
    </Provider>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

function DrawerNavigator(props) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SideBar {...props} />}
      drawerContentOptions={{
        activeBackgroundColor: null,
        itemStyle: {},
        labelStyle: {
          color: "#896C49",
          fontFamily: "Sukhumvit",
          fontSize: 15,
        },
      }}
      gestureHandlerProps={true}
      drawerType={"slide"}
      initialRouteName={"Main"}
    >
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          // gestureEnabled: false,
          title: "ข้อมูลผู้ใช้",
          drawerIcon: () => (
            <TouchableOpacity onPress={() => console.log("Hello")}>
              <Image
                style={{ width: 20, height: 20, resizeMode: "contain" }}
                source={require("../assets/images/Icon/user.png")}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen
        name="myPlant"
        component={userPlantStack}
        options={{
          title: "พืชของฉัน",
          drawerIcon: () => (
            <TouchableOpacity onPress={() => console.log("Hello")}>
              <Image
                style={{ width: 20, height: 20, resizeMode: "contain" }}
                source={require("../assets/images/Icon/myplants.png")}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen
        name="water"
        component={WaterScreen}
        options={{
          title: "ตารางรดน้ำ",
          drawerIcon: () => (
            <TouchableOpacity onPress={() => console.log("Hello")}>
              <Image
                style={{ width: 20, height: 20, resizeMode: "contain" }}
                source={require("../assets/images/Icon/watering-can.png")}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen
        name="feed"
        component={CommunityStack}
        options={{
          title: "ห้องพูดคุย",
          drawerIcon: () => (
            <TouchableOpacity onPress={() => console.log("Hello")}>
              <Image
                style={{ width: 20, height: 20, resizeMode: "contain" }}
                source={require("../assets/images/Icon/chat.png")}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen
        name="plantList"
        component={PlantListStack}
        options={{
          title: "ข้อมูลพืช",
          drawerIcon: () => (
            <TouchableOpacity onPress={() => console.log("Hello")}>
              <Image
                style={{ width: 20, height: 20, resizeMode: "contain" }}
                source={require("../assets/images/Icon/plants.png")}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen
        name="model"
        component={ModelStack}
        options={{
          title: "โมเดลต้นแบบ",
          drawerIcon: () => (
            <TouchableOpacity onPress={() => console.log("Hello")}>
              <Image
                style={{ width: 20, height: 20, resizeMode: "contain" }}
                source={require("../assets/images/Icon/model.png")}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen
        name="Favourite"
        component={FavouriteStack}
        options={{
          title: "ผู้ใช้ที่บันทึกไว้",
          drawerIcon: () => (
            <TouchableOpacity onPress={() => console.log("Hello")}>
              <Image
                style={{ width: 20, height: 20, resizeMode: "contain" }}
                source={require("../assets/images/Icon/bookmark.png")}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Drawer.Screen
        name="Main"
        component={AgricultureStack}
        options={{
          drawerLabel: () => null,
          title: null,
          drawerIcon: () => null,
        }}
      />
    </Drawer.Navigator>
  );
}

function userPlantStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="myPlant"
        component={UserPlantScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="userMap"
        component={UserAreaScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

function ModelStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="model" component={ModelScreen} />
      <Stack.Screen name="modelDetail" component={ModelDetailScreen} />
      <Stack.Screen
        name="anotherPost"
        component={AnotherPost}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

function PlantListStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="plantList" component={PlantListScreen} />
      <Stack.Screen name="plant" component={PlantDetailScreen} />
    </Stack.Navigator>
  );
}

function CommunityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="feed" component={FeedScreen} />
      <Stack.Screen
        name="another"
        component={AnotherProfileScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="anotherPost"
        component={AnotherPost}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

function FavouriteStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="another"
        component={AnotherProfileScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="anotherPost"
        component={AnotherPost}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

function AgricultureStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Form"
        component={FormInputScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="form"
        component={FormScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="owner"
        component={OwnerLandScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="search"
        component={SearchMap}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="selectModel"
        component={SelectModelScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="AllResult"
        component={ResultingScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="customize"
        component={CustomizeScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="area"
        component={AreaScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="choice"
        component={ChoiceScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="modelDetail" component={ModelDetailScreen} />
      <Stack.Screen
        name="map"
        component={MapScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="setGrid"
        component={SetGridScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="verify"
        component={ConfirmScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="devide"
        component={DevideAreaScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="setMap"
        component={SettingMapScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="planting"
        component={PlantingMapScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="chooseCrop"
        component={ChooseCropScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={"Login"}
      screenOptions={{ headerShown: false }}
    >
      {/* <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          gestureEnabled: true,
        }}
      /> */}
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="forget" component={ForgetScreen} />
    </Stack.Navigator>
  );
}
