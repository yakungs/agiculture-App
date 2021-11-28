import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ImageBackground,
} from "react-native";
import MainLayout from "../../components/layout/MainLayout";

import { Button } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function WelcomeScreen(props) {
  return (
    <MainLayout
      {...props}
      title="เริ่มต้นการใช้งาน"
      header={true}
      // isBack={true}
    >
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
              height: "80%",
            }}
          >
            <View style={{ alignSelf: "center", paddingVertical: 50 }}>
              <View
                style={{
                  marginBottom: 20,
                  flex: 1,
                  justifyContent: "space-around",
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    color: "#896C49",
                    fontSize: 20,
                    marginBottom: 10,
                    fontFamily: "Sukhumvit",
                  }}
                >
                  "ยินดีต้อนรับ"
                </Text>
                <Text
                  style={{
                    color: "#896C49",
                    alignSelf: "center",
                    fontFamily: "Sukhumvit",
                    fontSize: 25,
                  }}
                >
                  ผู้ใช้ใหม่
                </Text>
                <Image
                  source={require("../../assets/images/break.png")}
                  style={{ width: 250, height: 200 }}
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
              onPress={() => props.navigation.navigate("Form")}
            >
              <Text style={styles.text}>เริ่มต้นการปลูกพืช</Text>
            </Button>
          </View>
          <TouchableOpacity
            style={{ flex: 1, alignSelf: "flex-end" }}
            onPress={() => {
              props.navigation.navigate("Main");
            }}
          >
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  color: "#707070",
                  fontSize: 16,
                  fontFamily: "Sukhumvit",
                }}
              >
                ข้ามขั้นตอนนี้ {">>"}
              </Text>
            </View>
          </TouchableOpacity>
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
