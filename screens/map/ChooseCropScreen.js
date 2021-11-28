import React, { useState } from "react";
import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from "react-native-maps";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Button,
  FlatList,
  Image,
} from "react-native";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import { ScrollView } from "react-native-gesture-handler";

import { bindActionCreators } from "redux";
import { UserMap } from "../../redux/actions/index";

//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

const ChooseCropScreen = (props) => {
  //modal
  const [visible, setVisible] = useState(false);

  const planting = props.route.params.plantingArea;

  const [plantArea, setPlantArea] = useState("")

  const [error, setError] = useState(false)

  //crop
  const [unique, setUnique] = useState("");

  const _chooseArea = (index, Area) => {
    setUnique(index);
    setVisible(!visible);
    setPlantArea(Area)
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() => toggleModal(item.item.name, item.item.area)}
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
            <Text style={styles.text}>{item.item.name} จำนวน {item.item.area} ไร่</Text>
            <Image
              source={require("../../assets/images/example/014-corn.png")}
              style={{
                width: 60,
                height: 60,
                alignSelf: "center",
                marginHorizontal: 10,
              }}
            ></Image>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const _modalPlant = () => {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Modal
          style={{ flex: 1 }}
          isVisible={visible}
          onBackdropPress={() => setVisible(false)}
          useNativeDriver={true}
          useNativeDriverForBackdrop={true}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              padding: 20,
            }}
          >
            <Text style={[styles.text, { alignSelf: "center" }]}>
              เลือกพืชที่ต้องการปลูกในแปลง
            </Text>
            {props.currentUser.mode == "old"
              ? props.currentUser.result.plant.map((item, index) => {
                return (
                  <View key={index}>
                    <FlatList
                      data={item.allplants}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id}
                      numColumns={2}
                    />
                  </View>
                );
              })
              : props.currentUser.result.map((item, index) => {
                return (
                  <View key={index}>
                    <FlatList
                      data={item.allplants}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id}
                      numColumns={2}
                    />
                  </View>
                );
              })}
            {error ? <Text style={[styles.text, {color:'red', alignSelf: "center" }]}>
              แปลงปลูกไม่ถูกต้อง
            </Text> : null}
          </View>
        </Modal>
      </View>
    );
  };

  const toggleModal = (name, area) => {

    console.log("Hello", parseFloat(plantArea).toFixed(2), area)

    if (parseFloat(plantArea).toFixed(2) < area) {
      setError(true)
    } else {
      planting[unique].crop = name;
      setVisible(!visible);
      setError(false)
    }
  };

  const _polygonCenter = (coordinates) => {
    let x = coordinates.map((c) => c.latitude);
    let y = coordinates.map((c) => c.longitude);

    let minX = Math.min.apply(null, x);
    let maxX = Math.max.apply(null, x);

    let minY = Math.min.apply(null, y);
    let maxY = Math.max.apply(null, y);

    return {
      latitude: (minX + maxX) / 2,
      longitude: (minY + maxY) / 2,
    };
  };

  const _mapSuccess = () => {
    const userArea = {
      building: props.map.area,
      polygon: props.map.polygon,
      plantingArea: planting,
    };
    console.log(userArea);
    props.navigation.navigate("AllResult", { userArea: userArea });
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude:
            Object.keys(props.location).length == 0
              ? 15.2312
              : props.location.location.lat,
          longitude:
            Object.keys(props.location).length == 0
              ? 104.856001
              : props.location.location.lng,
          latitudeDelta: 0.0025,
          longitudeDelta: 0.0025,
        }}
      >
        {props.map.polygon.map((marker, index) => (
          <Polygon
            key={index}
            fillColor={"#FFFFFF"}
            coordinates={props.map.polygon}
          />
        ))}

        {planting.map((marker, index) => {
          return (
            <View key={index}>
              <Marker coordinate={_polygonCenter(marker.slt)}>
                <Text
                  note
                  style={{
                    fontSize: 15,
                    fontFamily: "Sukhumvit",
                    color: "#6F7070",
                  }}
                >
                  {marker.crop}
                </Text>
              </Marker>
              <Polygon
                fillColor={"#B1BF79"}
                coordinates={marker.slt}
                tappable={true}
                onPress={() => {
                  _chooseArea(index, marker.area);
                }}
              />
              {_modalPlant()}
            </View>
          );
        })}

        {props.map.area.map((marker, index) => {
          return (
            <View key={index}>
              <Marker coordinate={_polygonCenter(marker.slt)}>
                <Text note style={{ color: "#6F7070", fontSize: 15 }}>
                  {marker.crop}
                </Text>
              </Marker>
              <Polygon
                fillColor={marker.color}
                coordinates={marker.slt}
                tappable={true}
                onPress={() => {
                  _chooseArea(index);
                }}
              />
              {_modalPlant()}
            </View>
          );
        })}
      </MapView>

      <View
        style={{
          position: "absolute", //use absolute position to show button on top of the map
          top: "85%", //for center align
          alignSelf: "center", //for align to right
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#EFC66D",
            paddingHorizontal: "18%",
            borderRadius: 10,
            padding: "5%",
            alignItems: "center",
          }}
          onPress={() => {
            props.navigation.pop();
          }}
        >
          <Text style={styles.textButton}>ย้อนกลับ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#929F5D",
            paddingHorizontal: "18%",
            padding: "5%",
            alignItems: "center",
            borderRadius: 10,
          }}
          onPress={() => _mapSuccess()}
        >
          <Text style={styles.textButton}>เสร็จสิ้น</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  text: {
    fontFamily: "Sukhumvit",
    color: "#896C49",
    fontSize: 20,
  },
  textButton: {
    fontFamily: "Sukhumvit",
    color: "#FFFFFF",
  },
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      UserMap,
    },
    dispatch
  );

const mapStateToProps = (store) => ({
  currentUser: store.userState.userPlant.plant,
  map: store.userMapState.map,
  location: store.userMapState.location,
});

export default connect(mapStateToProps, mapDispatchProps)(ChooseCropScreen);
