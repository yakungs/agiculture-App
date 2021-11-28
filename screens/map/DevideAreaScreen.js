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
import { getDistance } from "geolib";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { UserMap } from "../../redux/actions/index";

import { AntDesign } from "@expo/vector-icons";

const DevideAreaScreen = (props) => {
  // polygon in object type
  const polygon = props.route.params.polygon;

  //polygon in array type
  const location = props.route.params.location;

  const [area, setArea] = useState([]);

  //check condition
  const [create, setCreate] = useState(false);

  //ตัวแปรที่ใช้สำหรับ แบ่งพื้นที่
  const [slt, setSlt] = useState([]);
  const [alrt, setAlrt] = useState(false);

  //modal
  const [visible, setVisible] = useState(false);

  //select point
  const onPanDrag = async (e) => {
    const lat = e.nativeEvent.coordinate.latitude;
    const lng = e.nativeEvent.coordinate.longitude;
    _checkArea([lat, lng], location, e.nativeEvent.coordinate);
  };

  //if point not exist polygon. it alert
  const _checkArea = (point, vs, area) => {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    var x = point[0],
      y = point[1];

    var inside = true;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0],
        yi = vs[i][1];
      var xj = vs[j][0],
        yj = vs[j][1];

      var intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    if (inside) {
      console.log("outside !!");
    } else {
      setSlt([...slt, area]);
    }

    setAlrt(inside);
  };

  const _createArea = () => {
    setArea([...area, { slt, color: "#EBA4A4", crop: "x" }]);
    setSlt([]);
    setCreate(true);
  };

  const hideAlert = () => {
    setAlrt(false);
  };

  const _success = async () => {
    props.UserMap(area, polygon, location);
    props.navigation.navigate("Form");
  };

  return (
    <View style={styles.container}>
      <AlertText
        useNativeDriver={true}
        hideAlert={() => hideAlert()}
        show={alrt}
        title="เกิดข้อผิดพลาด"
        alertText={"กรุณาเลือกจุดตามให้อยู่ในพื้นที่ที่กำหนด"}
      ></AlertText>
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
        onPress={(e) => {
          onPanDrag(e);
        }}
      >
        {polygon.map((marker, index) => (
          <Polygon key={index} fillColor={"#FFFFFF"} coordinates={polygon} />
        ))}

        {area.map((marker, index) => {
          return (
            <Polygon
              key={index}
              fillColor={marker.color}
              coordinates={marker.slt}
            />
          );
        })}

        {slt.map((marker, index) => (
          <Marker
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            key={index}
          >
            <CustomMarker item={marker} />
          </Marker>
        ))}
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
            แตะบริเวณพื้นที่ ที่ไม่ต้องการปลูกพืช เช่น บ่อน้ำ หรือ สิ่งก่อสร้าง
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
          <AntDesign
            name="checkcircleo"
            style={{ marginRight: 5, marginTop: 3 }}
            size={15}
            color="#FFFFFF"
          />
          <Text style={styles.text}>เสร็จสิ้น</Text>
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
  location: store.userLocationState.location,
});

export default connect(mapStateToProps, mapDispatchProps)(DevideAreaScreen);
