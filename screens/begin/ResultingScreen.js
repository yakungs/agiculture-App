import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import { Button } from "native-base";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import MapView, { PROVIDER_GOOGLE, Polygon, Overlay } from "react-native-maps";
//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

function ResiltingScreen(props) {
  const totalArea =
    props.userPlant.plant.mode == "custom"
      ? props.userPlant.plant.result.reduce((sum, item) => {
          item.allplants.map((val, index) => {
            sum += parseInt(val.area);
          });
          return sum;
        }, 0)
      : props.userPlant.plant.result.totalArea;

  const _SaveData = () => {
    const userPlant =
      props.userPlant.plant.mode == "custom"
        ? {
            plant: props.userPlant.plant.result,
            totalArea: totalArea,
          }
        : {
            plant: props.userPlant.plant.result.plant,
            totalArea: props.userPlant.plant.result.totalArea,
          };
    console.log("this is my plant", userPlant, props.route.params);
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update(userPlant);
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({ grid: props.route.params });
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({ map: props.map.data });
    props.navigation.navigate("Main");
  };

  const value = props.route.params;

  const _check = (val) => {
    return val == undefined ? null : val.color;
  };

  const renderItem = (item) => {
    // console.log(item.item.icon == undefined ? null : item.item.icon);
    return (
      <TouchableOpacity>
        <View
          style={{
            width: value.width,
            height: value.height,
            borderWidth: 0.4,
            opacity: 0.5,
            backgroundColor: _check(item.item),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={{
              uri: item.item.icon == undefined ? null : item.item.icon,
            }}
            style={{
              resizeMode: "cover",
              width: value.width,
              height: value.height,
            }}
          ></Image>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MainLayout
      {...props}
      title={"สรุปรายชื่อพืช"}
      isBack={true}
      header={true}
      isClose={true}
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
          <View style={{ flex: 10 }}>
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: "#E7E7DE",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Text
                style={{
                  color: "#896C49",
                  fontSize: 16,
                  fontFamily: "Sukhumvit",
                }}
              >
                รายชื่อพืชที่เลือก :
              </Text>
              <Text
                style={{
                  color: "#896C49",
                  fontSize: 16,
                  fontFamily: "Sukhumvit",
                }}
              >
                ขนาดแปลง :
              </Text>
            </View>
            <View
              style={{
                paddingBottom: "20%",
                borderBottomWidth: 1,
                borderColor: "#E7E7DE",
              }}
            >
              {props.userPlant.plant.mode == "custom"
                ? props.userPlant.plant.result.map((item, index) => {
                    return (
                      <View key={index}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={[styles.text, { color: "black" }]}>
                            {item.type}
                          </Text>
                        </View>
                        {item.allplants.map((val, idx) => {
                          return (
                            <View
                              key={idx}
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginHorizontal: "5%",
                                marginVertical: "3%",
                              }}
                            >
                              <Text style={styles.text}>{val.name}</Text>
                              <Text style={styles.text}>
                                {val.area + " ไร่"}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    );
                  })
                : props.userPlant.plant.result.plant.map((item, index) => {
                    return (
                      <View key={index}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={styles.text}>{item.type}</Text>
                        </View>
                        {item.allplants.map((val, idx) => {
                          return (
                            <View
                              key={idx}
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginHorizontal: "5%",
                                marginVertical: "3%",
                              }}
                            >
                              <Text style={styles.text}>{val.name}</Text>
                              <Text style={styles.text}>
                                {val.area + " ไร่"}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
            </View>
            <View style={{ flex: 1, marginTop: "5%" }}>
              <View
                style={{ flexDirection: "row", justifyContent: "flex-end" }}
              >
                <Text style={[styles.text]}>พื้นที่ทั้งหมด</Text>
                <Text style={[styles.text, { paddingHorizontal: "10%" }]}>
                  {totalArea} ไร่
                </Text>
              </View>
            </View>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ flex: 5, padding: 10 }}
              region={value.region}
            >
              {/* <Overlay>
                <FlatList
                  data={value.grid}
                  renderItem={renderItem}
                  scrollEnabled={false}
                  keyExtractor={(item) => item}
                  numColumns={value.column}
                  key={value.column}
                ></FlatList>
              </Overlay> */}
              <Polygon
                fillColor={"white"}
                coordinates={props.map.data.polygon}
              />
            </MapView>
          </View>
        </View>
        {/* <View
          style={{
            flex: 1,
            padding: 20,
            backgroundColor: "white",
          }}
        >
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 10 }}
            initialRegion={{
              latitude: 15.2312,
              longitude: 104.856001,
              latitudeDelta: 0.0025,
              longitudeDelta: 0.0025,
            }}
          >
            {allPolygon.polygon.map((marker, index) => (
              <Polygon
                key={index}
                fillColor={"#FFFFFF"}
                coordinates={allPolygon.polygon}
              />
            ))}

            {allPolygon.plantingArea.map((marker, index) => {
              return (
                <View key={index}>
                  <Marker coordinate={_polygonCenter(marker.slt)}>
                    <Text note style={{ color: "#000", fontSize: 15 }}>
                      {marker.crop}
                    </Text>
                  </Marker>
                  <Polygon fillColor={"#B1BF79"} coordinates={marker.slt} />
                </View>
              );
            })}

            {allPolygon.building.map((marker, index) => {
              return (
                <View key={index}>
                  <Marker coordinate={_polygonCenter(marker.slt)}>
                    <Text note style={{ color: "#000", fontSize: 15 }}>
                      {marker.crop}
                    </Text>
                  </Marker>
                  <Polygon fillColor={marker.color} coordinates={marker.slt} />
                </View>
              );
            })}
          </MapView>
        </View> */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              // marginTop: 15,
              justifyContent: "space-around",
            }}
          >
            <Button
              style={{
                alignSelf: "center",
                width: "40%",
                justifyContent: "center",
                borderRadius: 10,
              }}
              warning
              onPress={() => props.navigation.pop()}
            >
              <Text style={{ color: "#FBFBFB", fontFamily: "Sukhumvit" }}>
                ย้อนกลับ
              </Text>
            </Button>
            <Button
              style={{
                alignSelf: "center",
                width: "40%",
                justifyContent: "center",
                borderRadius: 10,
              }}
              success
              onPress={() => _SaveData()}
            >
              <Text style={{ color: "white", fontFamily: "Sukhumvit" }}>
                เสร็จสิ้น
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </MainLayout>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  userPlant: store.userState.userPlant,
  map: store.userMapState.map,
});

export default connect(mapStateToProps, null)(ResiltingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00fa9a",
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: 500,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    color: "#896C49",
    fontFamily: "Sukhumvit",
    fontSize: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
