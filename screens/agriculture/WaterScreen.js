import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Button } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import MainLayout from "../../components/layout/MainLayout";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { connect } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import firebase from "firebase";

function WaterScreen(props) {
  const [checkMorning, setMorning] = useState(false);
  const [checkEvening, setEvening] = useState(false);
  const [edit, setEdit] = useState(false);

  const _edit = () => {
    setEdit(true);
  };

  const _checkWater = (item, time) => { };

  const [water, setWater] = useState(props.currentUser.plant);

  const onChange = (event, value, index, itemIndex, type, test) => {
    console.log(moment(value).format("HH:mm"), index, itemIndex, type);
    const newWater = [...water];
    // console.log(new Date(value));
    if (type == "morning") {
      // newWater[index].allplants[itemIndex].watering.morning = moment(
      //   value
      // ).format("HH:mm");
      newWater[index].allplants[itemIndex].watering.morning = new Date(value);
    } else {
      // newWater[index].allplants[itemIndex].watering.evening = moment(
      //   value
      // ).format("HH:mm");
      newWater[index].allplants[itemIndex].watering.evening = new Date(value);
    }
    // console.log(newWater);
    setWater(newWater);
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({ plant: water });
  };

  const _changeShow = (time) => {
    // console.log(time);
    return time;
  };

  const renderItem = (item, index) => {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            margin: "5%",
            backgroundColor: "#EFEFE7",
            borderRadius: 10,
          }}
        >
          <View
            style={{
              height: 150,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.text}>{item.item.name}</Text>
            <Image
              source={{ uri: item.item.icon }}
              style={{
                width: 60,
                height: 60,
                alignSelf: "center",
                marginHorizontal: 10,
              }}
            ></Image>
          </View>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              backgroundColor: "#E1DDD6",
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              padding: 10,
            }}
          >
            {Object.keys(item.item.watering).map((itm, idx) => {
              return (
                <View style={{ padding: 10, flexDirection: "row" }} key={idx}>
                  {itm == "morning" ? (
                    <Image
                      source={require("../../assets/images/sun.png")}
                      style={{ width: 35, height: 35, marginRight: 10 }}
                    ></Image>
                  ) : (
                    <Image
                      source={require("../../assets/images/night.png")}
                      style={{ width: 35, height: 35, marginRight: 10 }}
                    ></Image>
                  )}
                  {edit ? (
                    <DateTimePicker
                      style={{ flex: 1 }}
                      testID="dateTimePicker"
                      value={_changeShow(item.item.watering[itm].toDate())}
                      mode={"time"}
                      is24Hour={true}
                      display="default"
                      onChange={(event, value) =>
                        onChange(event, value, index, item.index, itm)
                      }
                    />
                  ) : (
                    <View
                      style={{
                        alignSelf: "center",
                      }}
                    >
                      <Text style={styles.text}>
                        {moment(item.item.watering[itm].toDate()).format(
                          "HH:mm"
                        )}
                      </Text>
                      {/* <TouchableOpacity
                        style={{ alignSelf: "center" }}
                        onPress={() => _checkWater(item.item, itm)}
                      >
                        <AntDesign
                          name="checkcircleo"
                          size={24}
                          color="#896C49"
                        />
                      </TouchableOpacity> */}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const _saveTime = () => {
    setEdit(false);
  };

  return (
    <MainLayout {...props} title={"ตารางรดน้ำ"} isBack={true} header={true} isEdit={true} _edit={() =>_edit()}>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          width: "90%",
        }}
      >
        {props.currentUser.plant.length > 0 ? (
          <ScrollView
            style={{
              flex: 6,
              backgroundColor: "white",
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <View style={{ flex: 3 }}>
              <View
                style={{
                  paddingBottom: "20%",
                }}
              >
                {props.currentUser.plant.map((item, index) => {
                  return (
                    <View key={index}>
                      <FlatList
                        data={item.allplants}
                        renderItem={(item) => renderItem(item, index)}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={{}}>
              <View
                style={{
                  flexDirection: "row",
                  // marginTop: 15,
                  justifyContent: "space-around",
                }}
              >
                {
                  edit ? <Button
                    style={{
                      alignSelf: "center",
                      width: "40%",
                      justifyContent: "center",
                      borderRadius: 10,
                    }}
                    warning
                    onPress={() => _saveTime()}
                  >
                    <Text style={{ color: "#FBFBFB", fontFamily: "Sukhumvit" }}>
                      {"บันทึก"}
                    </Text>
                  </Button> :null
}
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 20,
                  justifyContent: "center",
                  alignSelf: "center",
                },
              ]}
            >
              "ไม่มีพืชที่ปลูกในเวลานี้"
            </Text>
          </View>
        )}
      </View>
    </MainLayout>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(WaterScreen);

const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    color: "#896C49",
    fontFamily: "Sukhumvit",
  },
  waterText: {
    fontSize: 16,
    color: "#896C49",
    fontFamily: "Sukhumvit",
  },
  container: {
    backgroundColor: "#F2F2EF",
    borderRadius: 5,
    flexDirection: "row",
    flex: 0.1,
  },
  containerItem: {
    backgroundColor: "#F2F2EF",
    borderRadius: 10,
    width: "100%",
  },
  text: {
    color: "#896C49",
    fontFamily: "Sukhumvit",
  },
  wrapper: {
    flex: 1,
  },
});
