import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import { Button } from "native-base";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { connect } from "react-redux";

//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

function UserPlantScreen(props) {
  const totalArea = props.currentUser.plant.reduce((sum, item) => {
    item.allplants.map((val) => {
      sum += parseInt(val.area);
    });
    return sum;
  }, 0);

  const _navigateToMap = () => {
    if (
      props.currentUser.plant.length == 0
    ) {
    } else {
      props.navigation.navigate("userMap");
    }
  };

  const _checkTypeArea = (item) => {
    const totalArea = item.reduce((sum, val) => {
      sum += parseInt(val.area);
      return sum;
    }, 0);
    return totalArea + " ไร่";
  };

  const renderItem = (item) => {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            margin: "5%",
            backgroundColor: "#EFEFE7",
            borderRadius: 10,
          }}
        >
          <View
            style={{
              height: 150,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.text}>{item.item.name}</Text>
            <Image
              source={{uri:item.item.icon}}
              style={{
                width: 60,
                height: 60,
                alignSelf: "center",
                marginHorizontal: 10,
              }}
            ></Image>
          </View>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              backgroundColor: "#E1DDD6",
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              padding: 10,
            }}
          >
            <Text style={styles.text}>{item.item.area} ไร่</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <MainLayout {...props} title={"พืชของฉัน"} isBack={true} header={true}>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          width: "90%",
        }}
      >
        <ScrollView
          style={{
            flex: 6,
            backgroundColor: "white",
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          {props.currentUser.plant.length > 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginVertical: "5%",
              }}
            >
              <View
                style={{
                  backgroundColor: "#EFEFE7",
                  height: 120,
                  width: 120,
                  borderRadius: 100,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.text}>ขนาดแปลง</Text>
                <Text style={[styles.text, { fontSize: 25 }]}>{totalArea}</Text>
                <Text style={styles.text}>ไร่</Text>
              </View>
            </View>
          ) : null}
          <View style={{ flex: 3 }}>
            <View
              style={{
                paddingBottom: "20%",
              }}
            >
              {props.currentUser.plant.map((item, index) => {
                return (
                  <View key={index}>
                    <View
                      style={{
                        backgroundColor: "#E7E9DF",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: "3%",
                        paddingHorizontal: "10%",
                      }}
                    >
                      <Text style={styles.text}>{item.type} :</Text>
                      <Text style={styles.text}>
                        {_checkTypeArea(item.allplants)}
                      </Text>
                    </View>
                    <FlatList
                      data={item.allplants}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id}
                      numColumns={2}
                    />
                  </View>
                );
              })}
            </View>
            {props.currentUser.plant.length > 0 ? (
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={{
                    alignSelf: "center",
                    padding: 20,
                    backgroundColor: "#EFEFE7",
                  }}
                  onPress={() => {
                    _navigateToMap();
                  }}
                >
                  <Text style={styles.text}>
                    {props.currentUser.plant.length == 0
                      ? "ผู้ใช้ยังไม่ได้ทำการปลูกพืช"
                      : "หน้าต่างแสดงพื้นที่ของเจ้าของ"}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text
                  style={[
                    styles.text,
                    {
                      justifyContent: "center",
                      alignSelf: "center",
                    },
                  ]}
                >
                  "ไม่มีพืชที่ปลูกในเวลานี้"
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </MainLayout>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
});

export default connect(mapStateToProps, null)(UserPlantScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00fa9a",
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: 500,
  },
  text: {
    color: "#896C49",
    fontFamily: "Sukhumvit",
    fontSize: 16,
  },
});
