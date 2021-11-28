import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { Card, CardItem } from "native-base";
import { Feather, AntDesign, FontAwesome } from "@expo/vector-icons";

//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");
export default function FovouriteBox(props) {
  // console.log(props.item)
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => props._navigateToAnotherProfile(props.item)}
    >
      {props.edit ? (
        <TouchableOpacity
          style={{
            backgroundColor: "#E64C3C",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
          onPress={() => {
            props._unFollowUser(props.item.id);
          }}
        >
          <FontAwesome name="trash-o" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      ) : null}
      <CardItem style={styles.containerItem}>
        {props.edit ? null : (
          <TouchableOpacity
            onPress={() => {
              props._navigateToAnotherProfile(props.item);
            }}
          >
            <Image
              source={
                props.item.imageURL
                  ? { uri: props.item.imageURL }
                  : require("../../../assets/images/user_avatar.png")
              }
              style={{
                width: 50,
                height: 50,
                justifyContent: "center",
                alignSelf: "center",
                borderRadius: 50,
              }}
            ></Image>
          </TouchableOpacity>
        )}
        <View style={{ flexDirection: "column", flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: "5%",
            }}
          >
            <Text style={styles.text}>คุณ {props.item.name}</Text>
            {/* <Feather name="more-vertical" size={20} color="#896C49" /> */}
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: "5%",
            }}
          >
            <Text style={styles.text}>
              จำนวนไร่{" "}
              {props.item.totalArea
                ? props.item.totalArea + " ไร่"
                : "ยังไม่ได้ปลูก"}{" "}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AntDesign
                style={{ marginRight: 10 }}
                name="hearto"
                size={20}
                color="#896C49"
              />
              <Text style={styles.text}>{} </Text>
            </View>
          </View>
        </View>
      </CardItem>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F2EF",
    borderRadius: 10,
    flex: 0.22,
    marginTop: 10,
    flexDirection: "row",
  },
  containerItem: {
    backgroundColor: "#F2F2EF",
    borderRadius: 10,
    flex: 4,
  },
  text: {
    color: "#896C49",
    fontFamily: "Sukhumvit",
  },
});
