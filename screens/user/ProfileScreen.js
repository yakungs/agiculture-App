import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Platform } from "react-native";
import { Button } from "native-base";
import MainLayout from "../../components/layout/MainLayout";
import ProfilePic from "../../components/common/Item/ProfilePic";
import FormInput from "../../components/common/formInput/FormInput";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import moment from "moment";

//redux
import { connect } from "react-redux";

//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

function ProfileScreen(props) {
  //data from Main Screen
  const [image, setImage] = useState(props.currentUser.imageURL);
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState(props.currentUser);
  const [follow, setAllFollow] = useState();
  //set Form for send to Firebase
  const _formInput = (value, name) => {
    setUser({
      ...user,
      [name]: value,
    });
  };
  const _Greeting = (currentTime) => {
    if (!currentTime || !currentTime.isValid()) {
      return "Hello";
    }

    const splitAfternoon = 12; // 24hr time to split the afternoon
    const splitEvening = 17; // 24hr time to split the evening
    const splitGoonight = 5;
    const currentHour = parseFloat(new Date().getHours());
    if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
      // Between 12 PM and 5PM
      return "สวัสดีตอนบ่าย, ";
    } else if (currentHour >= splitEvening) {
      // Between 5PM and Midnight
      return "สวัสดีตอนเย็น, ";
    } else if (currentHour <= splitGoonight) {
      return "สวัสดีตอนกลางคืน, ";
    }
    // Between dawn and noon
    return "สวัสดีตอนเช้า, ";
  };

  useEffect(() => {
    async function fetchData() {
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
    fetchData();
    const unsubscribe = props.navigation.addListener("focus", () => {
      console.log("Hi");
      setEdit(false);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.currentUser]);

  //upload Image
  const _uploadImage = async () => {
    const uri = image;
    const path = `users/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;

    const response = await fetch(uri);
    const blob = await response.blob();
    const task = firebase.storage().ref().child(path).put(blob);
    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };
    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  //edit Profile
  const _editProfile = () => {
    setEdit(!edit);
    if (edit) {
      _uploadImage();
    }
  };

  //Save Data
  const savePostData = (downloadURL) => {
    const userForm = {
      imageURL: downloadURL,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      tel: user.tel,
    };
    console.log(firebase.auth().currentUser.uid, userForm);
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update(userForm);
  };

  //Pick Image from Gallerry
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <MainLayout
      {...props}
      title={"ข้อมูลผู้ใช้"}
      isBack={true}
      header={true}
      isClose={edit ? true : false}
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
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: "#896C49",
                  marginRight: 10,
                }}
              >
                <Text style={styles.HeaderText}>
                  {_Greeting(moment())}{" "}
                  <Text style={styles.name}>{user.name}</Text>
                </Text>
              </View>
              <Text style={styles.LikeText}>
                {" "}
                <AntDesign name="hearto" size={20} color="#896C49" />
                {" " + follow}
              </Text>
            </View>
            <ProfilePic
              pickImage={() => pickImage()}
              image={image}
              edit={edit}
            ></ProfilePic>
          </View>
          <View
            style={{
              flex: 3,
              backgroundColor: "white",
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <FormInput
                title={"ชื่อ นามสกุล"}
                isRequire={false}
                _formInput={(value) => {
                  _formInput(value, "name");
                }}
                editable={edit}
                placeholder={user.name}
              ></FormInput>
              <FormInput
                title={"ชื่อเล่น"}
                isRequire={false}
                _formInput={(value) => {
                  _formInput(value, "nickname");
                }}
                editable={edit}
                placeholder={user.nickname}
              ></FormInput>
              <FormInput
                title={"อีเมลล์"}
                // _formInput={(value) => {
                //   _formInput(value, "name");
                // }}
                editable={false}
                placeholder={user.email}
              ></FormInput>
              <FormInput
                title={"เบอร์โทรศัพท์"}
                isRequire={false}
                editable={edit}
                placeholder={user.tel}
                _formInput={(value) => {
                  _formInput(value, "tel");
                }}
              ></FormInput>
            </ScrollView>
          </View>
          {!edit ? (
            <TouchableOpacity
              onPress={() => {
                _editProfile();
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  paddingHorizontal: "25%",
                }}
              >
                <Entypo name="edit" size={20} color="#896C49" />
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Sukhumvit",
                    color: "#896C49",
                  }}
                >
                  แก้ไขข้อมูลผู้ใช้งาน
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  paddingHorizontal: "25%",
                }}
              >
                <Entypo name="edit" size={20} color="white" />
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: "Sukhumvit",
                    color: "white",
                  }}
                >
                  {/* แก้ไขข้อมูลผู้ใช้งาน */}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {edit ? (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              // marginTop: 15,
              justifyContent: "space-around",
            }}
          >
            <Button
              style={{
                alignSelf: "center",
                width: "40%",
                justifyContent: "center",
                borderRadius: 10,
              }}
              warning
              onPress={() => setEdit(false)}
            >
              <Text style={{ color: "#FBFBFB", fontFamily: "Sukhumvit" }}>
                ย้อนกลับ
              </Text>
            </Button>
            <Button
              style={{
                alignSelf: "center",
                width: "40%",
                justifyContent: "center",
                borderRadius: 10,
              }}
              success
              onPress={() => _editProfile()}
            >
              <Text style={{ color: "#FBFBFB", fontFamily: "Sukhumvit" }}>
                บันทึก
              </Text>
            </Button>
          </View>
        ) : (
          <View style={{ flex: 1 }}></View>
        )}
      </View>
    </MainLayout>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(ProfileScreen);

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
