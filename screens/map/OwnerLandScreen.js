import React, { useState, useEffect } from "react";
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

const OwnerLandScreen = (props) => {
  const data = props.route.params.deedInfo;

  const _mapSuccess = () => {
    // console.log(data)
    props.UserMap(data);
    props.navigation.navigate("choice", { form: data });
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: data.coordinates.lat,
          longitude: data.coordinates.lon,
          latitudeDelta: 0.0025,
          longitudeDelta: 0.0025,
        }}
      >
        <Polygon fillColor={"white"} coordinates={data.polygon} />
      </MapView>

      <View
        style={{
          position: "absolute", //use absolute position to show button on top of the map
          top: "60%", //for center align
          alignSelf: "center", //for align to right
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          width: "80%",
          height: "20%",
          // opacity: 0.8,
          borderWidth: 1,
          borderRadius: 10,
        }}
      >
        <View style={{ width: "80%", height: "100%" }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={styles.textInfo}>หมายเลขโฉนด : </Text>
            <Text style={styles.textInfo}>{data.deedNumber}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={styles.textInfo}>หมายเลขที่ดิน : </Text>
            <Text style={styles.textInfo}>{data.landNumber}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={styles.textInfo}>พื้นที่ : </Text>
            <Text style={styles.textInfo}>
              {data.area.areaUnit + " " + data.area.unit}
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={styles.textInfo}>เจ้าของ : </Text>
            <Text style={styles.textInfo}>{data.owner}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text style={styles.textInfo}>จังหวัด : </Text>
            <Text style={styles.textInfo}>{data.province}</Text>
          </View>
        </View>
      </View>

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
          <Text style={styles.textButton}>ยืนยัน</Text>
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
  textInfo: {
    fontFamily: "Sukhumvit",
    color: "black",
    fontSize: 16,
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

export default connect(mapStateToProps, mapDispatchProps)(OwnerLandScreen);
