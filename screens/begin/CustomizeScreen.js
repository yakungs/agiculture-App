import React, { useEffect, useState } from "react";
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
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

//redux
import { connect } from "react-redux";

function CustomizeScreen(props) {
  const [choose, setChoose] = useState([]);
  const form = props.route.params.item;

  //category
  const [backyard, setBackYard] = useState([]);
  const [economic, setEconomic] = useState([]);
  const [fruit, setFruit] = useState([]);

  const _choosePlant = (item) => {
    // console.log("Choose ", item);
    setChoose([...choose, item]);
  };

  const _deletePlant = (value) => {
    setChoose(choose.filter((item) => item.id !== value.id));
  };

  const _savePlant = () => {
    const format = [
      {
        type: "พืชเศรษฐกิจ",
        allplants: choose.filter((item) => {
          return item.type == "พืชเศรษฐกิจ";
        }),
      },
      {
        type: "พืชสวนครัว",
        allplants: choose.filter((item) => {
          return item.type == "พืชสวนครัว";
        }),
      },
      {
        type: "ไม้ผล",
        allplants: choose.filter((item) => {
          return item.type == "ไม้ผล";
        }),
      },
    ];
    props.navigation.navigate("area", {
      listPlant: format,
      form: form,
      mode: "custom",
    });
  };

  const _checkPlant = (item) => {
    const flag = choose.findIndex((obj) => {
      return obj.id == item.item.id;
    });
    if (flag != -1) {
      return (
        <TouchableOpacity
          onPress={() => {
            _deletePlant(item.item);
          }}
        >
          <Ionicons name="ios-checkbox-outline" size={24} color="#896C49" />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            _choosePlant(item.item);
          }}
        >
          <MaterialCommunityIcons
            name="checkbox-blank-outline"
            size={24}
            color="#896C49"
          />
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
          justifyContent: "space-between",
          marginHorizontal: "5%",
          marginVertical: "3%",
        }}
      >
        {_checkPlant(item)}

        <Text style={styles.text}>{item.item.name}</Text>
      </View>
    );
  };

  return (
    <MainLayout
      {...props}
      title={"เริ่มต้นใช้งาน"}
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
          <View style={{ flex: 3, alignItems: "center" }}>
            <View
              style={{
                borderRadius: 60,
                backgroundColor: "#EACD8D",
                width: "40%",
                height: "100%",
                justifyContent: "center",
                borderColor: "#8B9859",
              }}
            >
              <Text
                style={{
                  color: "#707070",
                  fontFamily: "Sukhumvit",
                  fontSize: 30,
                  alignSelf: "center",
                }}
              >
                {form.area}
              </Text>
              <Text
                style={{
                  color: "#707070",
                  fontFamily: "Sukhumvit",
                  fontSize: 16,
                  alignSelf: "center",
                }}
              >
                ไร่
              </Text>
            </View>
          </View>
          <View style={{ flex: 10 }}>
            <View style={{ borderBottomWidth: 1, borderColor: "#E7E7DE" }}>
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
          </View>
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
              onPress={() => _savePlant()}
            >
              <Text style={{ color: "#EEE3A1", fontFamily: "Sukhumvit" }}>
                ต่อไป
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </MainLayout>
  );
}

const mapStateToProps = (store) => ({
  plants: store.plantState.plants,
});

export default connect(mapStateToProps, null)(CustomizeScreen);

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
