import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Platform,
  Image,
} from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import {
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { SwipeablePanel } from "rn-swipeable-panel";

//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function PlantListScreen(props) {
  //mock up
  const [model, setModel] = useState([]);
  const [sort, setSort] = useState("totalArea");
  const [search, setSearch] = useState("");

  useEffect(() => {
    var didCancel = false;
    if (!didCancel) {
      firebase
        .firestore()
        .collection("models")
        .orderBy(sort, "desc")
        .get()
        .then((item) => {
          const data = item.docs.map((value) => {
            const data = value.data();
            const id = value.id;
            return { id, ...data };
          });

          setModel(
            data.filter((item) => {
              return item.name.match(search);
            })
          );
        });
    }
    return () => (didCancel = true);
  }, [model]);

  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    // openLarge: false,
    noBackgroundOpacity: true,
    showCloseButton: true,
    onlySmall: true,
    closeOnTouchOutside: true,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
  });
  const [isPanelActive, setIsPanelActive] = useState(false);
  const openPanel = () => {
    setIsPanelActive(true);
  };
  const closePanel = () => {
    setIsPanelActive(false);
  };

  return (
    <MainLayout
      {...props}
      title={"โมเดลที่สำเร็จ"}
      isBack={true}
      header={true}
      isSort={true}
      openPanel={() => openPanel()}
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
                placeholder="ค้นหารายชื่อเกษตรกร"
                placeholderTextColor="#BAA5A5"
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
          {model.map((item, index) => {
            return (
              <TouchableOpacity
                style={styles.cardContain}
                onPress={() => {
                  props.navigation.navigate("modelDetail", { item: item });
                }}
                key={index}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    marginHorizontal: 5,
                  }}
                >
                  <Text style={styles.text}>{item.name}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <AntDesign name="hearto" size={15} color="green" />
                    <Text style={[styles.text, { marginLeft: 10 }]}>
                      {item.popularity}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginHorizontal: 5,
                  }}
                >
                  <Text style={styles.text}>{item.totalArea} ไร่</Text>
                  <Image
                    source={require("../../assets/images/076-award.png")}
                    style={{ height: 25, width: 25 }}
                  ></Image>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ flex: 0.2 }}></View>
      </View>
      <SwipeablePanel
        style={{
          // borderWidth: 1,
          justifyContent: "center",
          height: Platform.OS === "ios" ? 400 : 700,
          backgroundColor: "#C6C7B8",
        }}
        {...panelProps}
        isActive={isPanelActive}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            // justifyContent: "center",
            // alignItems: "center",
            marginTop: 20,
            // borderWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: "center",
              width: "50%",
              flexDirection: "row",
              // borderWidth: 1,
              marginBottom: 15,
            }}
            onPress={() => setSort("popularity")}
          >
            <AntDesign
              style={{ marginRight: 10 }}
              name="hearto"
              size={24}
              color="#707070"
            />
            <Text style={styles.swipeText}>เรียงตามจำนวนที่ถูกใจ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: "center",
              width: "50%",
              flexDirection: "row",
              // borderWidth: 1,
            }}
            onPress={() => setSort("totalArea")}
          >
            <MaterialCommunityIcons
              name="sort-variant"
              style={{ marginRight: 10 }}
              size={24}
              color="#707070"
            />
            <Text style={styles.swipeText}>เรียงตามจำนวนไร่</Text>
          </TouchableOpacity>
        </View>
      </SwipeablePanel>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  cardContain: {
    marginTop: "5%",
    marginBottom: "10%",
    padding: 20,
    backgroundColor: "#E7E9DF",
    flexDirection: "column",
    borderRadius: 5,
  },
  swipeText: {
    color: "#707070",
    fontSize: 15,
    fontFamily: "Sukhumvit",
  },
  text: {
    color: "green",
    fontSize: 15,
    fontFamily: "Sukhumvit",
  },
});
