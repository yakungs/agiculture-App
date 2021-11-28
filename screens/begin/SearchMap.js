import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, TextInput, Image } from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/formInput/FormInput";
import { Button } from "native-base";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Axios from "axios";
import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from "react-native-maps";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { UserLocation } from "../../redux/actions/index";

function SearchMap(props) {
  const [geoLocation, setGeoLocation] = useState({});
  const [address, setAddress] = useState("");

  const _nextStep = async () => {
    await props.UserLocation(geoLocation, address);
    props.navigation.navigate("Form");
  };

  const _getLatLon = async (placeid, name) => {
    const resData = await Axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=AIzaSyCCFuA0jDhcRvNC_Sdy315xHc7xeB70ENI`
    ).then((value) => {
      setGeoLocation(value.data.result.geometry.location);
      setAddress(name);
    });
  };

  return (
    <MainLayout
      {...props}
      title={"เลือกสถานที่ตั้ง"}
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
          <GooglePlacesAutocomplete
            placeholder="สถานที่ตั้ง"
            onPress={(data, details = null) => {
              _getLatLon(details.place_id, details.description);
            }}
            minLength={2}
            onFail={(error) => console.error(error)}
            GooglePlacesDetailsQuery={{ fields: "geometry" }}
            query={{
              key: "AIzaSyCCFuA0jDhcRvNC_Sdy315xHc7xeB70ENI",
              language: "th",
              components: "country:th",
              types: "geocode",
            }}
            styles={{
              textInputContainer: {
                marginTop: 10,
              },
              textInput: {
                height: 38,
                color: "#5d5d5d",
                fontSize: 16,
                borderWidth: 1,
                borderRadius: 10,
              },
              container: {},
            }}
            getDefaultValue={() => {
              return ""; // text input default value
            }}
            listViewDisplayed={"auto"}
          />
        </View>
        <View style={{ flex: 2 }}>
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
              onPress={() => _nextStep()}
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

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      UserLocation,
    },
    dispatch
  );

const mapStateToProps = (store) => ({
  map: store.userMapState.map,
});

export default connect(mapStateToProps, mapDispatchProps)(SearchMap);

const styles = StyleSheet.create({
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
