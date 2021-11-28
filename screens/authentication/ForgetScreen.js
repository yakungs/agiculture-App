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
import Modal from "react-native-modal";

export default function ForgetScreen(props) {
  const [errorText, setErrorText] = useState("");
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");

  //modal
  const [visible, setVisible] = useState(false);

  const _forgetPassword = () => {
    if (email == "") {
      console.log("Plz enter emai");
      setErrorText("กรุณากรอกอีเมล");
      setVisible(true);
    } else {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then((user) => {
          console.log("Please check your email...");
          setVisible(true);
          setErrorText("กรุณาเช็คอีเมลของคุณ");
        })
        .catch(function (e) {
          console.log(e);
          setErrorText("อีเมลไม่ถูกต้อง");
          setVisible(true);
        });
    }
  };
  const _formInput = (value, name) => {
    setEmail(value);
  };

  return (
    <MainLayout {...props} title={"ลืมรหัสผ่าน"} isBack={true} header={true}>
      <Modal
        isVisible={visible}
        onBackdropPress={() => setVisible(false)}
        useNativeDriver={true}
        useNativeDriverForBackdrop={true}
      >
        <View
          style={{
            // flex: 1,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: "white",
            padding: 20,

            justifyContent: "center",
          }}
        >
          <Text>{errorText}</Text>
        </View>
      </Modal>
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
              title={"อีเมล"}
              placeholder={"อีเมล"}
              isRequire={true}
              _formInput={(value) => {
                _formInput(value, "name");
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
          {/* <Button
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
          </Button> */}
          <Button
            style={{
              alignSelf: "center",
              width: "80%",
              justifyContent: "center",
              borderRadius: 10,
            }}
            success
            onPress={() => _forgetPassword()}
          >
            <Text style={{ color: "white", fontFamily: "Sukhumvit" }}>
              ยืนยัน
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
