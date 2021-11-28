import React, { useEffect, useState } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import Animated from "react-native-reanimated";
import { View, StyleSheet, Image, Text } from "react-native";
//redux
import { connect } from "react-redux";

import { AntDesign } from "@expo/vector-icons";

//firebase
import firebase from "firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
require("firebase/firestore");
require("firebase/firebase-storage");
function Sidebar({ progress, ...props }) {
  const [follow, setAllFollow] = useState("");

  // const { progress, state, ...rest } = props;
  // const newState = { ...state }; //copy from state before applying any filter. do not change original state
  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });
  // newState.routes = newState.routes.filter((item) => item.name !== "Main");
  // console.log(newState);
  useEffect(() => {
    // props.dispatch(FetchUser());
    var didCancel = false;
    if (!didCancel) {
      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("likes")
        .get()
        .then((snapshot) => {
          setAllFollow(snapshot.size);
        });
    }
    return () => (didCancel = true);
  }, [props.currentUser]);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.2 }} />
      <View style={{ flex: 0.5, marginHorizontal: "5%" }}>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Profile")}
          >
            <Image
              source={
                props.currentUser.imageURL
                  ? { uri: props.currentUser.imageURL }
                  : require("../../assets/images/user_avatar.png")
              }
              style={{
                width: 80,
                height: 80,
                borderRadius: 50,
              }}
            ></Image>
          </TouchableOpacity>
          <Text style={styles.text}>{props.currentUser.name}</Text>

          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <AntDesign name="hearto" size={20} color="#896C49" />
            {/* <Text style={styles.text}>likes</Text> */}
            <Text style={styles.text}>{" " + follow}</Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 2, marginHorizontal: "2%" }}>
        <DrawerContentScrollView {...props}>
          <Animated.View style={{ transform: [{ translateX }] }}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="ออกจากระบบ"
              onPress={() => firebase.auth().signOut()}
              labelStyle={{
                color: "#896C49",
                fontFamily: "Sukhumvit",
                fontSize: 15,
              }}
              icon={() => (
                <TouchableOpacity onPress={() => firebase.auth().signOut()}>
                  <Image
                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                    source={require("../../assets/images/Icon/logout.png")}
                  />
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </DrawerContentScrollView>
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(Sidebar);

const styles = StyleSheet.create({
  text: {
    color: "#896C49",
    fontFamily: "Sukhumvit",
    fontSize: 15,
  },
});
