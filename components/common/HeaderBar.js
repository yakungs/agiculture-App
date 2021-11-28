import React from "react";
import {
  Container,
  Button,
  Left,
  Header,
  Body,
  Title,
  Right,
  Icon,
} from "native-base";
import { StyleSheet, StatusBar, Text, View, Platform } from "react-native";
import {
  Ionicons,
  Entypo,
  EvilIcons,
  AntDesign
} from "@expo/vector-icons";
//firebase
import * as firebase from "firebase";

export default function HeaderBar(props) {
  const _logOut = () => {
    firebase.auth().signOut();
  };

  return (
    <Header style={styles.header}>
      <StatusBar backgroundColor="#00fa9a" />
      {props.isHide ? (
        <Left style={{ flex: 1, alignItems: "center" }}></Left>
      ) : (
        <Left style={{ flex: 1, alignItems: "center" }}>
          {props.isBack ? (
            <Button
              transparent
              onPress={() =>
                props.isClose
                  ? props.navigation.navigate("Main")
                  : props.navigation.goBack()
              }
            >
              {props.isClose ? (
                <EvilIcons
                  name="close"
                  style={{ color: "#896C49", fontSize: 30 }}
                />
              ) : (
                <Ionicons
                  name="ios-arrow-back"
                  style={{ color: "#896C49", fontSize: 30 }}
                />
              )}
            </Button>
          ) : (
            <Button transparent onPress={() => props.navigation.openDrawer()}>
              <Entypo name="menu" size={30} color="#896C49" />
            </Button>
          )}
        </Left>
      )}
      <Body style={{ flex: 2, alignItems: "center" }}>
        <Text style={styles.title}>{props.title}</Text>
      </Body>
      <Right
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        {props.isSort ? (
          <Button transparent onPress={() => props.openPanel()}>
            <Entypo name="dots-three-vertical" size={24} color="#896C49" />
          </Button>
        ) : null}
        {props.isEdit ? <Button transparent onPress={() => props._edit()}>
          <AntDesign name="edit" size={24} color="#896C49" />
        </Button> : null}
      </Right>
    </Header>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#E7E6DE",
  },
  title: {
    color: "#896C49",
    fontSize: 20,
    fontFamily: "Sukhumvit",
  },
});
