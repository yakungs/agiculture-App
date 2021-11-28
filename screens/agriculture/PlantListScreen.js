import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import { Ionicons, Feather } from "@expo/vector-icons";

//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");
export default function PlantListScreen(props) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  const [image, setImage] = useState("NO");

  useEffect(() => {
    var didCancel = false;
    if (!didCancel) {
      firebase
        .firestore()
        .collection("plants")
        .get()
        .then((item) => {
          const data = item.docs.map((value) => {
            const data = value.data();
            const id = value.id;
            return { id, ...data };
          });

          setData(data);
        });
    }
    return () => (didCancel = true);
  }, []);

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        style={styles.flatCard}
        onPress={() => {
          props.navigation.navigate("plant", { item: item.item });
        }}
      >
        <Image
          source={{ uri: item.item.icon }}
          style={{
            width: 40,
            height: 40,
          }}
        ></Image>
        <Text style={styles.text}>{item.item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <MainLayout
      {...props}
      title={"ข้อมูลพืช"}
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
          style={{
            flex: 6,
            backgroundColor: "white",
            borderRadius: 10,
            marginTop: 10,
            padding: 20,
          }}
        >
          <View
            style={{
              padding: "3%",
              backgroundColor: "#F4F4F4",
              borderRadius: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <TextInput
                style={{ flex: 10 }}
                onChangeText={(text) => {
                  setSearch(text);
                }}
                value={search}
              ></TextInput>
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  borderRightWidth: 1,
                  paddingRight: "2%",
                }}
              >
                <Ionicons
                  name="md-close"
                  size={24}
                  color="#707070"
                  onPress={() => setSearch("")}
                />
              </View>
              <View style={{ flex: 1, paddingLeft: "2%", marginTop: 1 }}>
                <Feather name="search" size={21} color="#707070" />
              </View>
            </View>
          </View>
          <FlatList
            data={data.filter((item) => {
              return item.name.toLowerCase().match(search);
            })}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
          />
        </View>
        <View style={{ flex: 0.2 }}></View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  flatCard: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    margin: "3%",
    padding: "5%",
    borderRadius: 10,
    backgroundColor: "#E7E7DE",
  },
  text: {
    color: "#896C49",
    fontFamily: "Sukhumvit",
    fontSize: 16,
  },
});
