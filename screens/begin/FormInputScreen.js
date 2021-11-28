import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/formInput/FormInput";
import { Button } from "native-base";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from "react-native-maps";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { UserMap } from "../../redux/actions/index";

function FormScreen(props) {
  const [error, setError] = useState(false);
  const [form, setForm] = useState({
    soil: "",
    area: "",
    address: "อุบลราชธานี",
  });

  const [errorText, setErrorText] = useState("");

  const _formInput = (text, type) => {
    setForm((oldState) => ({ ...oldState, [type]: text }));
  };
  const _nextStep = () => {
    if (form.area == "") {
      setError(true);
      setErrorText("กรุณากรอกข้อมูลให้ครบ");
    } else if (Object.keys(props.map).length == 0) {
      setError(true);
      setErrorText("กรุณาเลือกพื้นที่");
    } else {
      props.navigation.navigate("choice", { form: form });
    }
  };

  const _checkArea = () => {
    if (form.area == "") {
      setError(true);
      setErrorText("กรุณาเลือกจำนวนไร่");
    } else {
      props.navigation.navigate("map",{area:form.area});
    }
  }

  return (
    <MainLayout
      {...props}
      title={"กรอกข้อมูลเบื้องต้น"}
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
          <FormInput
            title={"ขนาดพื้นที่"}
            placeholder={"ไร่"}
            isRequire={true}
            _formInput={(text) => {
              _formInput(text, "area");
            }}
          ></FormInput>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("search");
            }}
          >
            <Text style={styles.text}>
              {"สถานที่ตั้ง"}
              <Text style={{ color: "red" }}> *</Text>
            </Text>
            <View
              style={{
                fontSize: 14,
                opacity: 0.5,
                borderBottomWidth: 1,
                marginBottom: 10,
                marginLeft: 15,
                borderBottomColor: "#707070",
                fontFamily: "Sukhumvit",
                padding: 10,
              }}
            >
              <Text
                styles={{
                  fontSize: 16,
                  marginBottom: 10,
                  fontFamily: "Sukhumvit",
                  color: "#707070",
                }}
              >
                {props.location.address}
              </Text>
            </View>
          </TouchableOpacity>
          {error ? (
            <View>
              <Text style={styles.errorText}>{errorText}</Text>
            </View>
          ) : null}
          <View
            style={{
              flex: error ? 2 : 1,
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <Text style={styles.text}>
              กดที่แผนที่เพื่อเลือกพื้นที่แปลงปลูก
            </Text>
          </View>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 10, padding: 10 }}
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
              _checkArea()
            }}
          >
            <Polygon
              fillColor={"#FFFFFF"}
              coordinates={
                Object.keys(props.map).length == 0 ? [] : props.map.polygon
              }
            />

            {props.map.area == undefined
              ? null
              : props.map.area.map((marker, index) => {
                return (
                  <View key={index}>
                    <Polygon
                      fillColor={marker.color}
                      coordinates={marker.slt}
                    />
                  </View>
                );
              })}
          </MapView>
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
                ต่อไป
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
      UserMap,
    },
    dispatch
  );

const mapStateToProps = (store) => ({
  map: store.userMapState.map,
  location: store.userLocationState.location,
});

export default connect(mapStateToProps, mapDispatchProps)(FormScreen);

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
