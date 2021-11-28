import React, { useEffect, useState } from "react";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polygon,
  UrlTile,
  Overlay,
} from "react-native-maps";
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Button,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import CustomMarker from "../../components/common/maps/CustomMarker";

import Carousel from "react-native-snap-carousel";
//redux
import { connect } from "react-redux";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import * as geolib from "geolib";
import { map } from "../../redux/reducers/map";
const MapScreen = (props) => {
  const [create, setCreate] = useState(false);
  const region = props.route.params.current;
  const [active, setActive] = useState(-1);

  const height =
    props.route.params.size == undefined
      ? 20
      : parseInt(props.route.params.size.height);
  const width =
    props.route.params.size == undefined
      ? 20
      : parseInt(props.route.params.size.width);

  const [grid, setGrid] = useState([...Array(Math.floor(windowHeight)).keys()]);

  const [plant, setPlant] = useState({
    name: "",
    color: "",
  });

  const carouselRef = React.createRef();

  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1,
          height: 100,
          backgroundColor: index == active ? "#D9D9B4" : "white",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
        }}
        onPress={() => setArea(item, index)}
      >
        <Image
          source={{ uri: item.icon }}
          style={{
            width: 40,
            height: 40,
          }}
        ></Image>
        <Text key={index} style={styles.carouselText}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const setArea = (item, idx) => {
    setActive(idx);
    setPlant({
      icon: item.icon,
      name: item.name,
      color: item.color,
    });
  };

  const _setGrid = () => {
    props.navigation.navigate("setGrid");
  };

  const _check = (val) => {
    return val == undefined ? null : val.color;
  };

  const _colorSelect = (val, index) => {
    console.log(plant);
    const newArray = [...grid];
    if (typeof val == "object") {
      // const newArray = [...grid];
      newArray[index] = index;
      setGrid(newArray);
    } else {
      console.log(plant);
      newArray[val] = {
        name: plant.name,
        color: plant.color,
        icon: plant.icon,
      };
      setGrid(newArray);
    }
  };

  const getCenter = () => {
    const center = geolib.getCenter(props.map.data.polygon);
    return center;
  };

  const renderItem = (item) => {
    // console.log(item.item.icon == undefined ? "Cant" : item.item.icon);
    return (
      <TouchableOpacity onPress={() => _colorSelect(item.item, item.index)}>
        <View
          style={{
            width: width,
            height: height,
            borderWidth: 0.4,
            backgroundColor: _check(item.item),
            alignItems: "center",
            justifyContent: "center",
            borderColor: "#BEBEBE",
          }}
        >
          {/* <Text style={{ color: "black", fontSize: 14 }}>{item.item.icon}</Text> */}
          <Image
            source={{
              uri: item.item.icon == undefined ? null : item.item.icon,
            }}
            style={{
              // resizeMode: "cover",
              width: width,
              height: height,
            }}
          ></Image>
        </View>
      </TouchableOpacity>
    );
  };

  const _success = () => {
    console.log("Success");
    props.navigation.navigate("AllResult", {
      grid: grid,
      column: parseInt(windowWidth / width) + 1,
      width: width,
      height: height,
      region: region,
    });
  };

  const result = grid.some((val) => {
    return Object.keys(val).length > 0;
  });
  console.log(props.currentUser.crop);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        // mapType={"satellite"}
        region={region}
      >
        <Overlay
          bounds={[
            [13.78010814885327, 100.78935004770756],
            [13.780031626757552, 100.78938592225313],
          ]}
          image={"not EXIST"}
        >
          <FlatList
            data={grid}
            renderItem={renderItem}
            scrollEnabled={false}
            keyExtractor={(item) => item}
            numColumns={parseInt(windowWidth / width) + 1}
            key={parseInt(windowWidth / width) + 1}
          ></FlatList>
        </Overlay>
        <Polygon fillColor={"white"} coordinates={props.map.data.polygon} />
      </MapView>
      <View
        style={{
          position: "absolute", //use absolute position to show button on top of the map
          top: "5%", //for center align
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
            เลือกพืชพร้อมคลิกที่ปุ่มสี่เหลี่ยมเพื่อเป็นการจองพื้นที่
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
            _setGrid();
          }}
        >
          <AntDesign
            name="setting"
            style={{ marginRight: 5, marginTop: 3 }}
            size={15}
            color="#FFFFFF"
          />
          <Text style={styles.text}>ตั้งค่าตาราง</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: "absolute", //use absolute position to show button on top of the map
          top: "73%", //for center align
          zIndex: 10,
        }}
      >
        <Carousel
          ref={carouselRef}
          data={props.currentUser.crop}
          renderItem={_renderItem}
          sliderWidth={200}
          itemWidth={100}
          layout={"default"}
          removeClippedSubviews={false}
          firstItem={1}
          onSnapToIndex={(index) => setActive(index)}
        />
      </View>
      <View
        style={{
          position: "absolute", //use absolute position to show button on top of the map
          top: "90%", //for center align
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
            backgroundColor: result ? "#929F5D" : "#B1B4AD",
            paddingHorizontal: "18%",
            padding: "5%",
            alignItems: "center",
            borderRadius: 10,
          }}
          onPress={() => {
            result ? _success() : console.log("Can't");
          }}
        >
          <Text style={styles.text}>เสร็จสิ้น</Text>
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
    color: "#FFFFFF",
  },
  carouselText: {
    fontFamily: "Sukhumvit",
    color: "black",
  },
});

const mapStateToProps = (store) => ({
  map: store.userMapState.map,
  currentUser: store.userState.userPlant,
});

export default connect(mapStateToProps, null)(MapScreen);
