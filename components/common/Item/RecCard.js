import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Item } from "native-base";
export default function RecCard(props) {
  return (
    <TouchableOpacity
      style={[
        styles.cardContain,
        {
          borderColor: props.model.name == props.item.name ? "#929F5D" : null,
          borderWidth: props.model.name == props.item.name ? 2 : null,
        },
      ]}
      onPress={() =>
        props.navigation.navigate("modelDetail", { item: props.item })
      }
    >
      <TouchableOpacity
        style={{
          flex: 1,
          margin: 15,
          justifyContent: "center",
        }}
      >
        <Image
          source={
            props.item.imageURL
              ? { uri: props.item.imageURL }
              : require("../../../assets/images/user_avatar.png")
          }
          style={{
            width: 70,
            height: 70,
            justifyContent: "center",
            alignSelf: "center",
            borderRadius: 80,
            borderWidth: 1,

            borderColor: "white",
          }}
        ></Image>
      </TouchableOpacity>
      <View style={{ flex: 1, marginVertical: 15 }}>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
            marginHorizontal: "5%",
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={styles.text}>{props.item.name}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <AntDesign
              name="hearto"
              size={13}
              style={{ marginTop: 5 }}
              color="green"
            />
            <Text style={[styles.text, { marginLeft: 10 }]}>
              {props.item.popularity}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
            marginHorizontal: "5%",
          }}
        >
          <Text style={[styles.text, {}]}>{props.item.totalArea} ไร่</Text>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              borderRadius: 10,
              backgroundColor:
                props.model.name == props.item.name ? "#929F5D" : "#B79570",
              padding: "4%",
              width: 100,
            }}
            onPress={() => {
              props._selectModel(props.item);
            }}
          >
            <Text
              style={{
                fontFamily: "Sukhumvit",
                color: "white",
                alignSelf: "center",
              }}
            >
              {props.model.name == props.item.name ? "เลือกแล้ว" : "เลือก"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContain: {
    margin: 15,
    backgroundColor: "#E7E9DF",
    flexDirection: "row",
    borderRadius: 10,
    flex: 1,
  },
  text: {
    color: "#896C49",
    fontSize: 15,
    fontFamily: "Sukhumvit",
  },
});
