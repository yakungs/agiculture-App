import HeaderBar from "../common/HeaderBar";
import React from "react";
import { Container, Title } from "native-base";
import {
  KeyboardAvoidingView,
  StyleSheet,
  TouchableNativeFeedbackBase,
  ImageBackground,
} from "react-native";
export default function MainLayout(props) {
  return (
    <Container style={styles.container}>
      {props.header ? (
        <HeaderBar
          navigation={props.navigation}
          title={props.title}
          isBack={props.isBack}
          isClose={props.isClose}
          isLogout={props.isLogout}
          isHide={props.isHide}
          isSort={props.isSort}
          openPanel={props.openPanel}
          isHide={props.isHide}
          isEdit={props.isEdit}
          _edit={props._edit}
        ></HeaderBar>
      ) : null}
      <ImageBackground
        source={require("../../assets/images/bg.png")}
        style={styles.backContainer}
      >
        {props.children}
      </ImageBackground>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#F7F7F7",
  },
  backContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "cover",
    height: "57.5%",
  },
});
