import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import ProfilePic from "../../components/common/Item/ProfilePic";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import * as Location from "expo-location";
//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  FetchUser,
  FetchUserFollowing,
  FetchPlants,
} from "../../redux/actions/index";

//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

import Axios from "axios";

// notification
// import Constants from "expo-constants";
// import * as Notifications from "expo-notifications";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

function index(props) {
  //mavigate to profile
  const _navigateToProfile = () => {
    props.navigation.navigate("Profile", { currentUser: props.currentUser });
  };
  //for expo noti
  // const [expoPushToken, setExpoPushToken] = useState("");
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  const [weather, setWeather] = useState([]);

  const [follow, setAllFollow] = useState();

  const _Greeting = (currentTime) => {
    if (!currentTime || !currentTime.isValid()) {
      return "Hello";
    }

    const splitAfternoon = 12; // 24hr time to split the afternoon
    const splitEvening = 17; // 24hr time to split the evening
    const splitGoonight = 5;
    const currentHour = parseFloat(new Date().getHours());
    if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
      // Between 12 PM and 5PM
      return "สวัสดีตอนบ่าย, ";
    } else if (currentHour >= splitEvening) {
      // Between 5PM and Midnight
      return "สวัสดีตอนเย็น, ";
    } else if (currentHour <= splitGoonight) {
      return "สวัสดีตอนกลางคืน, ";
    }
    // Between dawn and noon
    return "สวัสดีตอนเช้า, ";
  };
  const _dayFormat = (date) => {
    const day = moment(date).format("DD MMM");
    return day;
  };
  const _timeFormat = (date) => {
    const day = moment(date).format("hh mm a");
    return day;
  };

  const _colorTemp = (temp) => {
    if (temp > 36) {
      return "#E7B872";
    } else if (temp >= 34 && temp <= 36) {
      return "#EEE0B9";
    } else if (temp >= 31 && temp <= 33) {
      return "#B8D7DB";
    } else {
      return "#81AEB5";
    }
  };

  useEffect(() => {
    async function fetchData() {
      const resData = await Axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?lat=15.2312&lon=104.856001&cnt=7&APPID=0ba243bc552348a0561920b99af86385&units=metric`
      );
      // console.log("HEllo", resData.data);
      setWeather(resData.data.list);
      // console.log(props.currentUser.id)
      props.FetchUser();
      props.FetchUserFollowing();
      props.FetchPlants();
      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("likes")
        .get()
        .then((snapshot) => {
          setAllFollow(snapshot.size);
        });
    }
    fetchData();
  }, [props.currentUser]);
  const _navigateToPlant = () => {
    if (props.currentUser.plant.length > 0) {
      props.navigation.navigate("myPlant");
    } else {
      props.navigation.navigate("form");
    }
  };

  const _wateringPlant = () => {
    return (
      <View
        style={{
          flex: 3,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
          }}
        >
          {props.currentUser.plant.map((item, index) => {
            return (
              <View key={index}>
                {/* <Image
                  source={require("../../assets/images/example/014-corn.png")}
                  style={{ width: 20, height: 20, borderWidth: 1 }}
                ></Image> */}
                {item.allplants.map((itm, idx) => {
                  return (
                    <Text
                      key={idx}
                      style={[styles.text, { alignSelf: "center" }]}
                    >
                      {itm.name}
                    </Text>
                  );
                })}
              </View>
            );
          })}
        </View>
        <View style={{ flex: 1, flexDirection: "column" }}>
          {props.currentUser.plant.map((item, index) => {
            return (
              <View key={index}>
                {/* <Image
                  source={require("../../assets/images/example/014-corn.png")}
                  style={{ width: 20, height: 20, borderWidth: 1 }}
                ></Image> */}
                {item.allplants.map((itm, idx) => {
                  return (
                    <Text
                      key={idx}
                      style={[styles.text, { alignSelf: "center" }]}
                    >
                      {itm.name}
                    </Text>
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <MainLayout
      {...props}
      title={"หน้าแรก"}
      isBack={false}
      header={true}
      isLogout={true}
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
            flex: 4,
            backgroundColor: "white",
            borderRadius: 10,
            marginTop: 10,
            padding: 20,
          }}
        >
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                marginTop: 10,
              }}
            >
              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: "#896C49",
                  marginRight: 10,
                }}
              >
                <Text style={styles.HeaderText}>
                  {_Greeting(moment())}
                  <Text style={styles.name}>{props.currentUser.name}</Text>
                </Text>
              </View>
              <Text style={styles.LikeText}>
                <AntDesign name="hearto" size={20} color="#896C49" />
                {" " + follow}
              </Text>
            </View>
            <TouchableOpacity onPress={() => _navigateToProfile()}>
              <Image
                source={
                  props.currentUser.imageURL
                    ? { uri: props.currentUser.imageURL }
                    : require("../../assets/images/user_avatar.png")
                }
                style={{
                  width: 100,
                  height: 100,
                  justifyContent: "center",
                  alignSelf: "center",
                  borderRadius: 50,
                }}
              ></Image>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 2, flexDirection: "column", marginTop: 10 }}>
            <View
              style={{
                flex: 4,
                // borderWidth: 1,
                flexDirection: "row",
                borderRadius: 20,
              }}
            >
              {weather.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      borderTopLeftRadius: index == 0 ? 10 : 0,
                      flex: 1,
                      flexDirection: "column",
                      backgroundColor: _colorTemp(item.main.feels_like),
                      borderTopRightRadius: index == 6 ? 10 : 0,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sukhumvit",
                        fontSize: 10,
                        color: "#3B3B3B",
                      }}
                    >
                      {_dayFormat(item.dt_txt)}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Sukhumvit",
                        fontSize: 10,
                        color: "#3B3B3B",
                      }}
                    >
                      {_timeFormat(item.dt_txt)}
                    </Text>
                    <Image
                      source={{
                        uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
                      }}
                      style={{
                        width: 25,
                        height: 25,
                        justifyContent: "center",
                        alignSelf: "center",
                        resizeMode: "cover",
                      }}
                    ></Image>
                    <Text style={{ fontFamily: "Sukhumvit", fontSize: 10 }}>
                      {item.main.feels_like + " °C"}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                borderRadius: 20,
              }}
            >
              {weather.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      borderBottomLeftRadius: index == 0 ? 10 : 0,
                      flex: 1,
                      flexDirection: "column",
                      backgroundColor: "#E7E7DE",
                      borderBottomRightRadius: index == 6 ? 10 : 0,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Sukhumvit",
                        fontSize: 10,
                        color: "#3B3B3B",
                      }}
                    >
                      {item.main.humidity + "%"}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
          <View
            style={{
              flex: 4,
              borderRadius: 10,
              backgroundColor: "#E7E6DE",
              marginTop: 10,
              flexDirection: "column",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "#C6C7B8",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <Text style={styles.text}>ตารางรดน้ำวันนี้</Text>
            </View>
            {props.currentUser["plant"] &&
            props.currentUser["plant"].length > 0 ? (
              <View style={{ flex: 5, flexDirection: "column" }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    borderBottomWidth: 1,
                    padding: 10,
                    borderColor: "#C6C7B8",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("../../assets/images/sun.png")}
                      style={{ width: 35, height: 35 }}
                    ></Image>
                    <Text style={styles.text}>ตอนเช้า</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={require("../../assets/images/night.png")}
                      style={{ width: 35, height: 35 }}
                    ></Image>
                    <Text style={styles.text}>ตอนเย็น</Text>
                  </View>
                </View>
                {_wateringPlant()}
              </View>
            ) : (
              <View
                style={{
                  flex: 5,
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignContent: "center",
                    justifyContent: "center",
                    padding: 10,
                  }}
                >
                  <Text style={[styles.text, { alignSelf: "center" }]}>
                    “ไม่มีพืชที่ปลูกในเวลานี้”
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    padding: 5,
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={require("../../assets/images/plants.png")}
                    style={{ width: 50, height: 50, alignSelf: "center" }}
                  ></Image>
                </View>
                <View
                  style={{
                    flex: 3,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 20,
                    borderRadius: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      width: "60%",
                      backgroundColor: "#C6C7B8",
                      flexDirection: "column",
                      justifyContent: "center",
                      borderRadius: 10,
                    }}
                    onPress={() => _navigateToPlant()}
                  >
                    <Text style={[styles.name, { alignSelf: "center" }]}>
                      {props.currentUser["plant"] &&
                      props.currentUser["plant"].length > 0
                        ? "พืชของฉัน"
                        : "เริ่มต้นการปลูก"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          <View style={{ flex: 2 }}>
            {/* <Image></Image>
            <Text>
              Title: {notification && notification.request.content.title}{" "}
            </Text>
            <Text>
              Body: {notification && notification.request.content.body}
            </Text>
            <Text>
              Data:{" "}
              {notification &&
                JSON.stringify(notification.request.content.data)}
            </Text> */}
          </View>
        </View>
      </View>
    </MainLayout>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  plants: store.plantState.plants,
  map: store.userMapState.map,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      FetchUser,
      FetchUserFollowing,
      FetchPlants,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(index);

const styles = StyleSheet.create({
  HeaderText: {
    fontSize: 16,
    color: "#896C49",
    fontFamily: "Sukhumvit",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    color: "#896C49",
    fontFamily: "Sukhumvit",
  },
  WeatherText: {
    fontSize: 10,
    color: "#3B3B3B",
    fontFamily: "Sukhumvit",
  },
  ModelText: {
    fontSize: 20,
    color: "#896C49",
    fontFamily: "Sukhumvit",
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  LikeText: {
    alignSelf: "flex-end",
    marginTop: 10,
    color: "#896C49",
    fontFamily: "Sukhumvit",
    fontSize: 20,
    marginRight: 10,
  },
  text: {
    fontFamily: "Sukhumvit",
    color: "#896C49",
    fontSize: 15,
  },
});
