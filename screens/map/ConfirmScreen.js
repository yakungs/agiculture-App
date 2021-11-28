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
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import CustomMarker from "../../components/common/maps/CustomMarker";
import { TouchableOpacity } from "react-native-gesture-handler";
import Carousel from "react-native-snap-carousel";
//redux
import { connect } from "react-redux";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import * as geolib from "geolib";
import { map } from "../../redux/reducers/map";
const ConfirmScreen = (props) => {
  const grid = props.route.params;

  const _success = () => {
    console.log("Success");
    props.navigation.navigate("AllResult", { grid: grid });
  };

  const _check = (val) => {
    return val == undefined ? null : val.color;
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity>
        <View
          style={{
            width: grid.width,
            height: grid.height,
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
              // resizeMode: "cover",
              width: grid.width,
              height: grid.height,
            }}
          ></Image>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        // mapType={"satellite"}
        region={grid.region}
      >
        <Overlay>
          <FlatList
            data={grid.grid}
            renderItem={renderItem}
            scrollEnabled={false}
            keyExtractor={(item) => item}
            numColumns={grid.column}
            key={grid.column}
          ></FlatList>
        </Overlay>
        <Polygon fillColor={"white"} coordinates={props.map.data.polygon} />
      </MapView>

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
            padding: "10%",
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
            backgroundColor: "#929F5D",
            paddingHorizontal: "18%",
            padding: "10%",
            alignItems: "center",
            borderRadius: 10,
          }}
          onPress={() => {
            _success();
          }}
        >
          <Text style={styles.text}>ยืนยัน</Text>
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

export default connect(mapStateToProps, null)(ConfirmScreen);
