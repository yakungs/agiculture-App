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
import AlertText from "../../components/common/alert/AlertText";
import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from "react-native-maps";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { UserMap } from "../../redux/actions/index";
import firebase, { firestore } from "firebase";

function SetGridScreen(props) {
  const [error, setError] = useState(false);
  const [size, setSize] = useState("");
  const [alrt, setAlrt] = useState(false);
  const [errorText, setErrorText] = useState("");

  const _formInput = (val, text) => {
    setSize({
      ...size,
      [val]: text,
    });
  };

  const _nextStep = () => {
    if (
      parseInt(size.width) < 20 ||
      parseInt(size.height) < 20 ||
      size.width == "" ||
      size.height == ""
    ) {
      setError(true);
    } else {
      // console.log("you can do it ")
      props.navigation.navigate("map", { size: size });
    }
  };

  return (
    <MainLayout
      {...props}
      title={"ตั้งค่าขนาดช่องตาราง"}
      isBack={true}
      header={true}
      // isClose={true}
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
            title={"แนวตั้ง (ควรระบุตั้งแต่ 20 ขึ้นไป)"}
            placeholder={"แนวตั้ง"}
            keyboardType={"number-pad"}
            isRequire={true}
            _formInput={(text) => {
              _formInput("height", text);
            }}
          ></FormInput>
          <FormInput
            keyboardType={"number-pad"}
            title={"แนวนอน (ควรระบุตั้งแต่ 20 ขึ้นไป)"}
            placeholder={"แนวนอน"}
            isRequire={true}
            _formInput={(text) => {
              _formInput("width", text);
            }}
          ></FormInput>
        </View>
        {error ? (
          <View>
            <Text style={styles.errorText}>กรุณากรอกเลขมากกว่า 20</Text>
          </View>
        ) : null}
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
                width: "80%",
                justifyContent: "center",
                borderRadius: 10,
              }}
              success
              onPress={() => _nextStep()}
            >
              <Text style={{ color: "white", fontFamily: "Sukhumvit" }}>
                ยืนยัน
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

export default connect(mapStateToProps, mapDispatchProps)(SetGridScreen);

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
