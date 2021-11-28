import React, { useState } from "react";
import MapView, { PROVIDER_GOOGLE, Polygon, Overlay } from "react-native-maps";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  FlatList,
  Image,
} from "react-native";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import * as geolib from "geolib";
//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

const UserAreaScreen = (props) => {
  const getCenter = () => {
    const center = geolib.getCenter(props.currentUser.map.polygon);
    return center;
  };
  const _check = (val) => {
    return val == undefined ? null : val.color;
  };

  const renderItem = (item) => {
    return (
      // <TouchableOpacity>
      //   <View
      //     style={{
      //       width: props.currentUser.grid.width,
      //       height: props.currentUser.grid.height,
      //       borderWidth: 0.4,
      //       opacity: 0.5,
      //       backgroundColor: _check(item.item),
      //       alignItems: 'center',
      //       justifyContent: 'center'
      //     }}
      //   >
      //     <Text style={{ color: "black", fontSize: 14 }}>{item.item.name}</Text>
      //   </View>
      // </TouchableOpacity>
      <TouchableOpacity>
        <View
          style={{
            width: props.currentUser.grid.width,
            height: props.currentUser.grid.height,
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
              width: props.currentUser.grid.width,
              height: props.currentUser.grid.height,
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
        region={props.currentUser.grid.region}
      >
        <Overlay>
          <FlatList
            data={props.currentUser.grid.grid}
            renderItem={renderItem}
            scrollEnabled={false}
            keyExtractor={(item) => item}
            numColumns={props.currentUser.grid.column}
          ></FlatList>
        </Overlay>
        <Polygon
          fillColor={"white"}
          coordinates={props.currentUser.map.polygon}
        />
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
          <Text style={styles.text}>ย้อนกลับ</Text>
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
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(UserAreaScreen);
