import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Button } from "native-base";
import MainLayout from "../../components/layout/MainLayout";

export default function HomeScreen(props) {
  return (
    <MainLayout {...props}>
      <View style={{ paddingBottom: "10%" }}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 100, height: 150 }}
        ></Image>
      </View>
      <Button
        style={{
          alignSelf: "center",
          width: "80%",
          justifyContent: "center",
          borderRadius: 10,
        }}
        success
        onPress={() => props.navigation.navigate("Login")}
      >
        <Text style={styles.text}>เข้าสู่ระบบ</Text>
      </Button>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
        }}
      >
        <View style={{ width: 140, justifyContent: "center" }}>
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
        <View style={{ width: 140, justifyContent: "center" }}>
          <View style={{ borderTopWidth: 1, borderColor: "#896C49" }}></View>
        </View>
      </View>
      <Button
        style={{
          alignSelf: "center",
          width: "80%",
          justifyContent: "center",
          borderRadius: 10,
        }}
        success
        onPress={() => props.navigation.navigate("Register")}
      >
        <Text style={styles.text}>สมัครสมาชิก</Text>
      </Button>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("forget")}
        style={{
          marginTop: 10,
          alignItems: "flex-end",
          width: "80%",
        }}
      >
        <Text style={[styles.text, { color: "black" }]}>ลืมรหัสผ่าน ?</Text>
      </TouchableOpacity>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontFamily: "Sukhumvit",
  },
});
