import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Button } from "native-base";
import MainLayout from "../../components/layout/MainLayout";
import FovouriteBox from "../../components/common/itemBox/FavouritBox";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { connect } from "react-redux";

//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

function FavouriteScreen(props) {
  const [edit, setEdit] = useState(false);
  const [following, setFollowing] = useState(props.following);
  const [id, setID] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    // console.log(props.following);
    const unsubscribe = props.navigation.addListener("focus", () => {
      setEdit(false);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [following]);

  const _unFollowUser = (uid) => {
    setID([...id, uid]);
    const newArray = following.filter((item) => {
      return item.id !== uid;
    });
    setFollowing(newArray);
    // firebase.firestore().collection('following').doc(firebase.auth().currentUser.uid).collection('userFollowing').doc(uid).delete()
  };

  const _saveFollowing = () => {
    try {
      id.map((item) => {
        firebase
          .firestore()
          .collection("following")
          .doc(firebase.auth().currentUser.uid)
          .collection("userFollowing")
          .doc(item)
          .delete();
      });
      setEdit(!edit);
      setID([]);
    } catch (error) {
      console.loh(error);
    }
  };

  const _navigateToAnotherProfile = (item) => {
    props.navigation.navigate("another", { user: item });
  };

  return (
    <MainLayout
      {...props}
      title={"ผู้ใช้ที่บันทึกไว้"}
      isBack={true}
      header={true}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          width: "90%",
        }}
      >
        <View
          style={{
            flex: 6,
            backgroundColor: "white",
            borderRadius: 10,
            marginTop: 10,
            padding: 20,
          }}
        >
          <View
            style={{
              padding: "3%",
              backgroundColor: "#F4F4F4",
              borderRadius: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{ flex: 10 }}
                placeholder="ค้นหารายชื่อเกษตรกร"
                placeholderTextColor="#BAA5A5"
                onChangeText={(text) => {
                  setSearch(text);
                }}
                value={search}
              ></TextInput>
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  borderRightWidth: 1,
                  paddingRight: "2%",
                }}
              >
                <Ionicons
                  name="md-close"
                  size={24}
                  color="#707070"
                  onPress={() => setSearch("")}
                />
              </View>
              <View style={{ flex: 1, paddingLeft: "2%", marginTop: 1 }}>
                <Feather name="search" size={21} color="#707070" />
              </View>
            </View>
          </View>
          {props.following
            .filter((item) => {
              return item.name.match(search);
            })
            .map((item, index) => {
              return (
                <FovouriteBox
                  key={index}
                  item={item}
                  edit={edit}
                  index={index}
                  _unFollowUser={(uid) => {
                    _unFollowUser(uid);
                  }}
                  _navigateToAnotherProfile={(uid) => {
                    _navigateToAnotherProfile(uid);
                  }}
                ></FovouriteBox>
              );
            })}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            // marginTop: 15,
            justifyContent: "space-around",
          }}
        >
          {/* {
            <Button
              style={{
                alignSelf: "center",
                width: "40%",
                justifyContent: "center",
                borderRadius: 10,
              }}
              warning
              onPress={() => (edit ? setEdit(!edit) : props.navigation.pop())}
            >
              <Text style={{ color: "#EEE3A1", fontFamily: "Sukhumvit" }}>
                ย้อนกลับ
              </Text>
            </Button>
          } */}
          <Button
            style={{
              alignSelf: "center",
              width: "80%",
              justifyContent: "center",
              borderRadius: 10,
            }}
            success
            onPress={() => {
              edit ? _saveFollowing() : setEdit(!edit);
            }}
          >
            <Text style={{ color: "white", fontFamily: "Sukhumvit" }}>
              {edit ? "บันทึก" : "แก้ไข"}
            </Text>
          </Button>
        </View>
      </View>
    </MainLayout>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(FavouriteScreen);

const styles = StyleSheet.create({
  HeaderText: {
    fontSize: 16,
    color: "#896C49",
    fontFamily: "Sukhumvit",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    color: "#896C49",
    fontFamily: "Sukhumvit",
  },
  WeatherText: {
    fontSize: 10,
    color: "#3B3B3B",
    fontFamily: "Sukhumvit",
  },
  CelsiusText: {
    fontSize: 30,
    color: "#3B3B3B",
    fontFamily: "Sukhumvit",
    alignSelf: "center",
  },
  LikeText: {
    alignSelf: "flex-end",
    marginTop: 10,
    color: "#896C49",
    fontFamily: "Sukhumvit",
    marginRight: 10,
  },
});
