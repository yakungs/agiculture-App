import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import MainLayout from "../../components/layout/MainLayout";
import { Left, Body, Title, Right, Icon, Button } from "native-base";
import * as firebase from "firebase";
import * as Google from "expo-google-app-auth";
import * as Facebook from "expo-facebook";

export default function LoginScreen(props) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [edit, setEdit] = useState(false);
  const [show, setShow] = useState(true);

  //Go to Main Screen
  const _navigateToMain = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, pass)
      .then((result) => {
        setEdit(false);
        console.log(result);
        // props.navigation.navigate("welcome");
      })
      .catch((error) => {
        setEdit(true);
        console.log(error);
      });
  };

  const onFacebookSignIn = async () => {
    try {
      await Facebook.initializeAsync({
        appId: "213232983666853",
      });
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email", "user_birthday"],
      });
      if (type === "success") {
        // console.log(token);
        // const response = await fetch(
        //   `https://graph.facebook.com/me?access_token=${token}`
        // );
        // console.log(await response.json());
        // Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        console.log(credential);
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((result) => {
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .firestore()
                .collection("users")
                .doc(result.user.uid)
                .set({
                  name: result.user.providerData[0].displayName,
                  nickname: result.user.providerData[0].displayName,
                  email: result.user.providerData[0].email,
                  tel: "",
                  plant: [],
                });
            }
          })
          .catch((e) => console.log(e));
      } else {
        console.log("Facebook login Error");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  const onSignIn = (googleUser) => {
    // console.log("Google Auth Response", googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );

        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((result) => {
            // console.log("user sign in", result);
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .firestore()
                .collection("users")
                .doc(result.user.uid)
                .set({
                  name: result.user.providerData[0].displayName,
                  nickname: result.user.providerData[0].displayName,
                  email: result.user.providerData[0].email,
                  tel: "",
                  plant: [],
                });
            }
          })
          .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      } else {
        console.log("User already signed-in Firebase.");
      }
    });
  };

  const onGoogleSignIn = async () => {
    console.log("LoginScreen.js 6 | loggin in");
    try {
      const result = await Google.logInAsync({
        // behavior: "web",
        iosClientId: `350582680044-4h1p73rlrfqeirnvbdqk8iikcillvgs1.apps.googleusercontent.com`,
        // androidClientId: `350582680044-g9cddqt0mib1v7i64v5ffukg9gmv94tk.apps.googleusercontent.com`,
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        // Then you can use the Google REST API
        onSignIn(result);
      }
    } catch (error) {
      console.log("LoginScreen.js 19 | error with login", error);
    }
  };

  return (
    <MainLayout {...props} title={"เข้าสู่ระบบ"} isHide={true} header={true}>
      <View style={{ flex: 3.5, marginTop: 10, marginBottom: 10 }}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 100, height: 150, resizeMode: "cover" }}
        ></Image>
      </View>
      <View
        style={{
          flex: 3,
          // borderWidth: 1,
          width: "80%",
          // alignItems: "center",
          // justifyContent: "center",
          // borderWidth: 1,
        }}
      >
        <View
          style={[
            styles.PasswordWapper,
            {
              borderWidth: edit ? 1 : null,
              borderColor: edit ? "#E64C3C" : null,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <TextInput
              placeholder="อีเมล"
              placeholderTextColor="#896C49"
              onChangeText={(text) => {
                setEmail(text);
              }}
              style={styles.TextInput}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType="default"
            />
            <TouchableOpacity
              style={{
                //   flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 20,
              }}
            >
              {/* <Image
                source={require("../../assets/images/view.svg")}
                style={{ width: 25, height: 25 }}
              ></Image> */}
              <MaterialIcons name="person-outline" size={24} color="#896C49" />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            styles.PasswordWapper,
            {
              borderWidth: edit ? 1 : null,
              borderColor: edit ? "#E64C3C" : null,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <TextInput
              placeholder="รหัสผ่าน"
              placeholderTextColor="#896C49"
              style={styles.TextInput}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType="default"
              secureTextEntry={show}
              onChangeText={(text) => {
                setPass(text);
              }}
            />
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 20,
              }}
              onPress={() => {
                setShow(!show);
              }}
            >
              {/* <Image
                    source={require("../../assets/images/view.svg")}
                    style={{ width: 10, height: 10 }}
                  ></Image> */}
              <AntDesign name="eyeo" size={24} color="#896C49" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {edit ? (
        <View style={{ flex: 0.5, marginBottom: 5, marginTop: 10 }}>
          <Text style={styles.errorText}>
            ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง
          </Text>
        </View>
      ) : null}
      <View
        style={{
          flex: 0.7,
          alignSelf: "center",
          width: "80%",
          alignItems: "flex-end",
          marginBottom: 10,
          // borderWidth: 1,
        }}
      >
        <TouchableOpacity
          style={{
            borderBottomWidth: 1,
            borderColor: "#896C49",
          }}
          onPress={() => props.navigation.navigate("forget")}
        >
          <Text
            style={{
              color: "#896C49",
              fontSize: 15,
              fontFamily: "Sukhumvit",
            }}
          >
            ลืมรหัสผ่าน
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          // borderWidth: 1,
          justifyContent: "center",
          width: "85%",
        }}
      >
        <Button
          style={{
            alignSelf: "center",
            width: "100%",
            justifyContent: "center",
            borderRadius: 10,
            // marginBottom: 20,
          }}
          success
          onPress={() => _navigateToMain()}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "Sukhumvit",
              // alignSelf: "center",
              // borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            เข้าสู่ระบบ
          </Text>
        </Button>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
          flex: 1,
          // borderWidth: 1,
        }}
      >
        <View style={{ width: "85%", justifyContent: "center" }}>
          <View style={{ borderTopWidth: 1, borderColor: "#896C49" }}></View>
        </View>
        <Text
          style={{
            color: "#896C49",
            marginHorizontal: 10,
            fontFamily: "Sukhumvit",
          }}
        >
          หรือ
        </Text>
        <View style={{ width: "85%", justifyContent: "center" }}>
          <View style={{ borderTopWidth: 1, borderColor: "#896C49" }}></View>
        </View>
      </View>
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          // borderWidth: 1,
          borderRadius: 10,
          justifyContent: "center",
          marginBottom: 10,
          width: "85%",
          backgroundColor: "#F2F3F5",
        }}
        onPress={() => onFacebookSignIn()}
      >
        <Image
          source={require("../../assets/images/facebook.png")}
          style={{
            width: 25,
            height: 25,
            resizeMode: "cover",
            alignSelf: "center",
            marginRight: 10,
          }}
        ></Image>
        <Text
          style={{
            color: "#896C49",
            fontFamily: "Sukhumvit",
            alignSelf: "center",
            // borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          เข้าสู่ระบบด้วยบัญชี Facebook
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: "row",
          // borderWidth: 1,
          borderRadius: 10,
          justifyContent: "center",
          marginBottom: 10,
          width: "85%",
          backgroundColor: "#F2F3F5",
        }}
        onPress={() => onGoogleSignIn()}
      >
        <Image
          source={require("../../assets/images/google.png")}
          style={{
            width: 25,
            height: 25,
            resizeMode: "cover",
            alignSelf: "center",
            marginRight: 10,
          }}
        ></Image>
        <Text
          style={{
            color: "#896C49",
            fontFamily: "Sukhumvit",
            alignSelf: "center",
            // borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          เข้าสู่ระบบด้วยบัญชี Google
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          alignSelf: "center",
          width: "80%",
          alignItems: "center",
          marginBottom: 10,
          // borderWidth: 1,
        }}
      >
        <TouchableOpacity
          style={{
            borderBottomWidth: 1,
            borderColor: "#896C49",
          }}
          onPress={() => props.navigation.navigate("Register")}
        >
          <Text
            style={{
              color: "#896C49",
              fontSize: 15,
              fontFamily: "Sukhumvit",
            }}
          >
            สมัครสมาชิก
          </Text>
        </TouchableOpacity>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  PasswordWapper: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 20,
  },
  TextInput: {
    paddingHorizontal: 20,
    height: 50,
    width: "90%",
    fontFamily: "Sukhumvit",
  },
  errorText: {
    fontFamily: "Sukhumvit",
    fontSize: 12,
    color: "#E64C3C",
  },
});
