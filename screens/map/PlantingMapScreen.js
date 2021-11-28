import React, { useEffect, useState } from "react";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Heatmap,
  Circle,
  Polyline,
  Polygon,
} from "react-native-maps";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import CustomMarker from "../../components/common/maps/CustomMarker";
import AlertText from "../../components/common/alert/AlertText";
import * as geolib from "geolib";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { UserMap } from "../../redux/actions/index";

import { AntDesign } from "@expo/vector-icons";

const PlatingMapScreen = (props) => {
  //check condition
  const [create, setCreate] = useState(false);
  const [current, setCurrent] = useState({
    latitude: props.map.data.coordinates.lat,
    longitude: props.map.data.coordinates.lon,
    latitudeDelta: 0.0025,
    longitudeDelta: 0.0025,
  });

  const _success = () => {
    props.navigation.navigate("map", { current: current });
  };

  const getCenter = () => {
    const center = geolib.getCenter(props.map.data.polygon);
    return center;
  };

  const _createArea = () => {
    setCreate(!create);
  };

  const onRegionChangeComplete = (selectedRegion) => {
    console.log(selectedRegion);
    setCurrent(selectedRegion);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={current}
        onRegionChange={(selectedRegion) =>
          onRegionChangeComplete(selectedRegion)
        }
      >
        <Polygon fillColor={"white"} coordinates={props.map.data.polygon} />
      </MapView>

      <View
        style={{
          position: "absolute", //use absolute position to show button on top of the map
          top: "10%", //for center align
          justifyContent: "flex-end",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <View
          style={{
            borderWidth: 1,
            padding: 20,
            backgroundColor: "white",
            borderColor: "#896C49",
          }}
        >
          <Text style={{ color: "#896C49", fontFamily: "Sukhumvit" }}>
            โปรดขยายหน้าจอบริเวณพื้นที่แปลงปลูกเพื่อเตรียมปลูกพืช
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            backgroundColor: "#929F5D",
            paddingHorizontal: "10%",
            borderRadius: 10,
            padding: "2%",
            marginTop: "5%",
          }}
          onPress={() => {
            _createArea();
          }}
        >
          {create ? (
            <AntDesign
              name="closecircleo"
              style={{ marginRight: 5, marginTop: 3 }}
              size={15}
              color="#FFFFFF"
            />
          ) : (
            <AntDesign
              name="checkcircleo"
              style={{ marginRight: 5, marginTop: 3 }}
              size={15}
              color="#FFFFFF"
            />
          )}
          <Text style={styles.text}> {create ? "ยกเลิก" : "เสร็จสิ้น"}</Text>
        </TouchableOpacity>
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
          <Text style={styles.text}>ย้อนกลับ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: create ? "#929F5D" : "#B1B4AD",
            paddingHorizontal: "18%",
            padding: "5%",
            alignItems: "center",
            borderRadius: 10,
          }}
          onPress={() => (create ? _success() : console.log("Cant"))}
        >
          <Text style={styles.text}>เสร็จสิ้น</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  members: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
  },
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

export default connect(mapStateToProps, mapDispatchProps)(PlatingMapScreen);
