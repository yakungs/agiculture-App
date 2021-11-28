import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/formInput/FormInput";
import { Button } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import * as firebase from "firebase";
import AlertText from "../../components/common/alert/AlertText";

export default function RegisterScreen(props) {
  const [regis, setRegis] = useState({
    plant: [],
  });
  const [show, setShow] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [data, setData] = useState([]);

  const _formInput = (value, name) => {
    setRegis({
      ...regis,
      [name]: value,
    });
  };

  const _signUp = () => {
    setShow(true);
    if (Object.keys(regis).length < 7) {
      setAlertText("กรุณากรอกข้อมูลให้ครบถ้วน");
      setShow(true);
    } else if (regis.password.length < 6) {
      setAlertText("กรุณาตั้งรหัสผ่านมากกว่า 6 ตัวอักษร");
      setShow(true);
    } else if (regis.password != regis.repassword) {
      setAlertText("รหัสผ่านไม่ตรงกัน");
      setShow(true);
    } else {
      setShow(false);
      firebase
        .auth()
        .createUserWithEmailAndPassword(regis.email, regis.password)
        .then((result) => {
          firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set(regis)
            .then(() => {
              firebase.auth().signOut();
            });
          props.navigation.navigate("Success");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const hideAlert = () => {
    setShow(false);
  };

  return (
    <MainLayout {...props} title={"สมัครสมาชิก"} isBack={true} header={true}>
      <AlertText
        hideAlert={() => hideAlert()}
        show={show}
        title="การสมัครสมาชิกไม่สำเร็จ"
        alertText={alertText}
      ></AlertText>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          width: "90%",
        }}
      >
        <View
          style={{
            flex: 4,
            backgroundColor: "white",
            borderRadius: 10,
            marginTop: 10,
            padding: 20,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <FormInput
              title={"ชื่อ นามสกุล"}
              placeholder={"ชื่อ นามสกุล"}
              isRequire={true}
              _formInput={(value) => {
                _formInput(value, "name");
              }}
            ></FormInput>
            <FormInput
              title={"ชื่อเล่น"}
              placeholder={"ชื่อเล่น"}
              isRequire={true}
              _formInput={(value) => {
                _formInput(value, "nickname");
              }}
            ></FormInput>
            <FormInput
              title={"อีเมล"}
              placeholder={"อีเมล"}
              isRequire={true}
              _formInput={(value) => {
                _formInput(value, "email");
              }}
            ></FormInput>
            <FormInput
              title={"เบอร์โทรศัพท์"}
              placeholder={"เบอร์โทรศัพท์"}
              isRequire={true}
              keyboardType={"number-pad"}
              maxLength={10}
              _formInput={(value) => {
                _formInput(value, "tel");
              }}
            ></FormInput>
            {/* <FormInput
              title={"ชื่อผู้ใช้ (สำหรับเข้าสู่ระบบ)"}
              placeholder={"ชื่อผู้ใช้ (สำหรับเข้าสู่ระบบ)"}
              isRequire={true}
              _formInput={(value) => {
                _formInput(value, "username");
              }}
            ></FormInput> */}
            <FormInput
              title={"รหัสผ่าน"}
              isRequire={true}
              _formInput={(value) => {
                _formInput(value, "password");
              }}
              secureTextEntry={true}
              placeholder={"รหัสผ่าน"}
            ></FormInput>
            <FormInput
              title={"ยืนยันรหัสผ่าน"}
              placeholder={"ยืนยันรหัสผ่าน"}
              isRequire={true}
              secureTextEntry={true}
              _formInput={(value) => {
                _formInput(value, "repassword");
              }}
            ></FormInput>
          </ScrollView>
        </View>
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
            onPress={() => props.navigation.navigate("Home")}
          >
            <Text style={{ color: "white", fontFamily: "Sukhumvit" }}>
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
            onPress={() => _signUp()}
          >
            <Text style={{ color: "white", fontFamily: "Sukhumvit" }}>
              ต่อไป
            </Text>
          </Button>
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "contain",
    height: "70%",
  },
});
