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

function FormScreen(props) {
  const [error, setError] = useState(false);
  const [deed, setDeed] = useState("");
  const [alrt, setAlrt] = useState(false);
  const [errorText, setErrorText] = useState("");

  const _formInput = (text) => {
    setDeed(text);
  };

  const _nextStep = () => {
    try {
      if (deed == "") {
        setError(true);
        setErrorText("กรุณากรอกเลขที่โฉนด");
      } else {
        firebase
          .firestore()
          .collection("userLocation")
          .where("deedNumber", "==", deed)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              console.log("No item");
              setAlrt(true);
            } else {
              querySnapshot.forEach((doc) => {
                if (doc.exists) {
                  console.log("Document data:", doc.data());
                  props.navigation.navigate("owner", { deedInfo: doc.data() });
                } else {
                  console.log("No such document!");
                }
              });
            }
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const hideAlert = () => {
    setAlrt(false);
  };

  return (
    <MainLayout
      {...props}
      title={"กรอกข้อมูลเบื้องต้น"}
      isBack={true}
      header={true}
      // isClose={true}
    >
      <AlertText
        hideAlert={() => hideAlert()}
        show={alrt}
        title="เกิดข้อผิดพลาด"
        alertText={"หมายเลขโฉนดไม่ถูกต้อง"}
      ></AlertText>
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
            title={"เลขที่โฉนด"}
            placeholder={"เลขที่โฉนด"}
            isRequire={true}
            _formInput={(text) => {
              _formInput(text);
            }}
          ></FormInput>
          {error ? (
            <View>
              <Text style={styles.errorText}>{errorText}</Text>
            </View>
          ) : null}
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
            {/* <Button
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
            </Button> */}
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
