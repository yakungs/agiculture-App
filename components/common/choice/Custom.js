import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";

//redux
import { connect } from "react-redux";

function Custom(props) {
  const [choose, setChoose] = useState([]);
  const [aware, setAware] = useState("");
  //   const form = props.route.params.item;

  const _choosePlant = (item) => {
    setChoose([...choose, item]);
    if (item.name == "ข้าว") {
      if (item.suitable.includes(parseInt(month))) {
        setAware("");
      } else {
        setAware("การปลูกแบบนาปี ไม่เหมาะกับการปลูกในช่วงเวลานี้");
      }
    } else {
      if (item.suitable.includes(parseInt(month))) {
        setAware("");
      } else {
        setAware(item.name + " ไม่เหมาะกับการปลูกในช่วงเวลานี้");
      }
    }
  };

  const _deletePlant = (value) => {
    setChoose(choose.filter((item) => item.id !== value.id));
    setAware("");
  };

  useEffect(() => {
    props._plant(choose);
  });

  const _checkPlant = (item) => {
    const flag = choose.findIndex((obj) => {
      return obj.id == item.item.id;
    });
    if (flag != -1) {
      return (
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row" }}
          onPress={() => {
            _deletePlant(item.item);
          }}
        >
          <Ionicons name="ios-checkbox-outline" size={24} color="#896C49" />
          <Image
            source={{ uri: item.item.icon }}
            style={{
              width: 20,
              height: 20,
              alignSelf: "center",
              marginHorizontal: 10,
            }}
          ></Image>
          <Text style={styles.text}>{item.item.name}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row" }}
          onPress={() => {
            _choosePlant(item.item);
          }}
        >
          <MaterialCommunityIcons
            name="checkbox-blank-outline"
            size={24}
            color="#896C49"
          />
          <Image
            source={{ uri: item.item.icon }}
            style={{
              width: 20,
              height: 20,
              alignSelf: "center",
              marginHorizontal: 10,
            }}
          ></Image>
          <Text style={styles.text}>{item.item.name}</Text>
        </TouchableOpacity>
      );
    }
  };

  const renderItem = (item) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginHorizontal: "7%",
          marginVertical: "2%",
        }}
      >
        {_checkPlant(item)}
      </View>
    );
  };

  const month = moment().format("M");

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
      }}
    >
      <View
        style={{
          flex: 6,
          backgroundColor: "white",
          borderRadius: 10,
        }}
      >
        <View style={{ flex: 10 }}>
          <View style={{ backgroundColor: "#E7E7DE", padding: 10 }}>
            <Text
              style={{
                color: "#896C49",
                fontSize: 16,
                fontFamily: "Sukhumvit",
              }}
            >
              รายชื่อพืช :
            </Text>
          </View>
          <View>
            <FlatList
              data={props.plants}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
            />
          </View>
          {/* {choose.map((item, index) => {
            return item.name == "ข้าว" ? item.suitable.includes(parseInt(month)) ? null : <View key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }} >
              <Text style={styles.text, { color: '#FBB959' }}>การปลูกแบบนาปี ไม่เหมาะกับการปลูกในช่วงเวลานี้</Text>
            </View>
              : item.suitable.includes(parseInt(month)) ? null :
                <View key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }} >
                  <Text style={styles.text, { color: '#FBB959' }}>{aware}</Text>
                </View>
          })} */}

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Text style={(styles.text, { color: "#FBB959" })}>{aware}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const mapStateToProps = (store) => ({
  plants: store.plantState.plants,
});

export default connect(mapStateToProps, null)(Custom);

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
