import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import { Ionicons, Feather } from "@expo/vector-icons";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import { Thumbnail, List, ListItem, Separator } from "native-base";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { useScrollToTop } from "@react-navigation/native";

//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function PlantListScreen(props) {
  const item = props.route.params.item;
  const [flag1, setFlag1] = useState(false);

  const [mode, setMode] = useState("planting");

  const [image, setImage] = useState(undefined);

  const scrollRef = useRef();
  useScrollToTop(scrollRef);

  useEffect(() => {
    async function fetchData() {
      const ref = firebase.storage().ref(`/plants/${item.nameEn}/${mode}.png`);
      await ref
        .getDownloadURL()
        .then((url) => {
          console.log("Hello", url);
          setImage(url);
        })
        .catch((e) => console.log("Errors while downloading => ", e));
    }
    fetchData();
  }, [mode]); // Or [] if effect doesn't need props or state

  const onPressTouch = (mode) => {
    setMode(mode);
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  return (
    <MainLayout
      {...props}
      title={item.name}
      isBack={true}
      header={false}
      header={true}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          width: "90%",
        }}
      >
        <View
          style={{ flex: 1, flexDirection: "row", backgroundColor: "white" }}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: mode == "planting" ? "#929F5D" : "#EFEFE7" },
              ]}
              onPress={() => onPressTouch("planting")}
            >
              <Image
                source={
                  mode == "planting"
                    ? require("../../assets/images/seeds-white.png")
                    : require("../../assets/images/seeds-brown.png")
                }
                style={{
                  width: 40,
                  height: 40,
                  alignSelf: "center",
                  margin: "10%",
                }}
              ></Image>
              <Text
                style={[
                  styles.text,
                  {
                    color: mode == "planting" ? "#FFFFFF" : "#896C49",
                    alignSelf: "center",
                  },
                ]}
              >
                การปลูก
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: mode == "pest" ? "#929F5D" : "#EFEFE7" },
              ]}
              onPress={() => onPressTouch("pest")}
            >
              <Image
                source={
                  mode == "pest"
                    ? require("../../assets/images/pest-white.png")
                    : require("../../assets/images/pest-brown.png")
                }
                style={{
                  width: 40,
                  height: 40,
                  alignSelf: "center",
                  margin: "10%",
                }}
              ></Image>
              <Text
                style={[
                  styles.text,
                  {
                    color: mode == "pest" ? "#FFFFFF" : "#896C49",
                    alignSelf: "center",
                  },
                ]}
              >
                โรคของพืช
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: mode == "takecare" ? "#929F5D" : "#EFEFE7" },
              ]}
              onPress={() => onPressTouch("takecare")}
            >
              <Text
                style={[
                  styles.text,
                  {
                    color: mode == "takecare" ? "#FFFFFF" : "#896C49",
                    alignSelf: "center",
                  },
                ]}
              >
                การดูแลรักษา
              </Text>
              <Image
                source={
                  mode == "takecare"
                    ? require("../../assets/images/planting-white.png")
                    : require("../../assets/images/planting-brown.png")
                }
                style={{
                  width: 40,
                  height: 40,
                  alignSelf: "center",
                  margin: "10%",
                }}
              ></Image>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: mode == "harvest" ? "#929F5D" : "#EFEFE7" },
              ]}
              onPress={() => onPressTouch("harvest")}
            >
              <Text
                style={[
                  styles.text,
                  {
                    color: mode == "harvest" ? "#FFFFFF" : "#896C49",
                    alignSelf: "center",
                  },
                ]}
              >
                การเก็บเกี่ยว
              </Text>
              <Image
                source={
                  mode == "harvest"
                    ? require("../../assets/images/harvest-white.png")
                    : require("../../assets/images/harvest-brown.png")
                }
                style={{
                  width: 40,
                  height: 40,
                  alignSelf: "center",
                  margin: "10%",
                }}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 2,
            backgroundColor: "white",
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <View style={{ flex: 3, flexDirection: "column" }}>
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={{ paddingBottom: 1000 }}
              showsHorizontalScrollIndicator={false}
            >
              <Image
                source={{ uri: item.icon }}
                style={{
                  width: 150,
                  height: 150,
                  alignSelf: "center",
                  margin: "10%",
                }}
              ></Image>
              <Text style={styles.headerText}>" {item.name} "</Text>
              <Image
                source={{
                  uri: image,
                }}
                style={{
                  height: "350%",
                  width: "100%",
                  resizeMode: "stretch",
                }}
              ></Image>
            </ScrollView>
          </View>
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  headerText: {
    color: "#896C49",
    alignSelf: "center",
    fontFamily: "Sukhumvit",
    fontSize: 20,
  },
  detail: {
    color: "#896C49",
    alignSelf: "center",
    fontFamily: "Sukhumvit",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#EFEFE7",
    justifyContent: "center",
    flexDirection: "row",
    margin: 10,
    borderRadius: 10,
  },
  text: {
    fontFamily: "Sukhumvit",
    fontSize: 15,
  },
});
