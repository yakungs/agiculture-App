import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import MainLayout from "../../components/layout/MainLayout";

import { Button } from "native-base";

export default function SuccessScreen(props) {
  return (
    <MainLayout {...props} title="เริ่มต้นใช้งาน" header={true}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            width: "90%",
            flexDirection: "column",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              marginTop: 10,
              padding: 20,
              height: "85%",
            }}
          >
            <View style={{ alignSelf: "center", paddingVertical: 50 }}>
              <Text
                style={{
                  alignSelf: "center",
                  color: "#896C49",
                  fontSize: 20,
                  marginBottom: 10,
                  fontFamily: "Sukhumvit",
                }}
              >
                "สมัครสมาชิกสำเร็จ"
              </Text>
              <Text
                style={{
                  color: "#896C49",
                  alignSelf: "center",
                  fontFamily: "Sukhumvit",
                }}
              >
                กลับสู้หน้าหลักเพื่อเข้าสู่ระบบ
              </Text>
              <View style={{ marginBottom: 20 }}>
                <Image
                  source={require("../../assets/images/082-farm.png")}
                  style={{ width: 250, height: 250 }}
                ></Image>
              </View>
            </View>
          </View>
          <View
            style={{
              // flex: 1,
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "space-around",
            }}
          >
            <Button
              style={{
                alignSelf: "center",
                width: "100%",
                justifyContent: "center",
                borderRadius: 10,
              }}
              success
              onPress={() => props.navigation.pop(2)}
            >
              <Text style={styles.text}>กลับสู่หน้าหลัก</Text>
            </Button>
          </View>
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontFamily: "Sukhumvit",
  },
});
