import React from "react";
import { StyleSheet, Text, View, TextInput, Image } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
export default function ProfilePic(props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        props.edit ? props.pickImage() : console.log("THIS NOT EDIT")
      }
    >
      <Image
        source={{ uri: props.image }}
        style={{
          flex: 1,
          alignSelf: "stretch",
          borderRadius: 100,
          width: 100,
          zIndex: -10,
        }}
      ></Image>
      {props._navigateToProfile ? null : (
        <View style={styles.textWrap}>
          <View
            style={{
              paddingHorizontal: "15%",
              backgroundColor: "#707070",
              opacity: 0.6,
            }}
          >
            {props.edit ? (
              <Text style={styles.text}>แตะเพื่อเปลี่ยน</Text>
            ) : null}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
    borderRadius: 100,
    backgroundColor: "#E7E8DF",
  },
  textWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontFamily: "Sukhumvit",
    fontSize: 12,
  },
});
