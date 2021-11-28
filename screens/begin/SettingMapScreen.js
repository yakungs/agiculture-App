import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Image } from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/formInput/FormInput";
import { Button } from "native-base";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Geocoder from "react-native-geocoding";
import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from "react-native-maps";
import * as geolib from "geolib";
//redux
import { connect } from "react-redux";

function SettingMapScreen(props) {



  const getCenter = () => {
    const center = geolib.getCenter(props.map.data.polygon);
    return center
  }

  return (
    <MainLayout
      {...props}
      title={"ตั้งค่าแปลง"}
      isBack={true}
      header={true}
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
          <View style={{ flex: 1, justifyContent: "center", padding: 5 }}>
            <Text style={styles.text}>ตั้งค่าขนาดแปลงปลูกพืช :</Text>
          </View>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 5, padding: 10 }}
            // mapType={"satellite"}
            onPress={(e) => {
              props.navigation.navigate("planting");
            }}
            region={{
              latitude:
                getCenter().latitude,
              longitude:
                getCenter().longitude,
              latitudeDelta: 0.0025,
              longitudeDelta: 0.0025,
            }}
          >
            <Polygon
              fillColor={"white"}
              coordinates={props.map.data.polygon}
            />

          </MapView>
          <View
            style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}
          >
            <Text style={styles.text}>กดที่แผนที่เพื่อตั้งค่าแปลงปลูกพืช</Text>
          </View>
        </View>

      </View>
    </MainLayout>
  );
}

const mapStateToProps = (store) => ({
  map: store.userMapState.map,
});

export default connect(mapStateToProps, null)(SettingMapScreen);

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    backgroundColor: "#00fa9a",
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: 500,
    // marginTop: "50%",
  },
  errorText: {
    fontFamily: "Sukhumvit",
    fontSize: 16,
    alignSelf: "flex-end",
    marginTop: 10,
    color: "#E64C3C",
  },
  addressText: {
    color: "black",
    margin: 3,
    fontFamily: "Calibri",
  },

  text: {
    color: "#896C49",
    fontFamily: "Sukhumvit",
    fontSize: 16,
  },
});
