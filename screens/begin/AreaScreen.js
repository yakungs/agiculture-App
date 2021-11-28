import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
} from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import { Button } from "native-base";
import Model from "../../components/common/choice/Model";
import Custom from "../../components/common/choice/Custom";
import AlertText from "../../components/common/alert/AlertText";
//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { UserPlant } from "../../redux/actions/index";

function AreaScreen(props) {
  const [error, setError] = useState(false);
  const [alrt, setAlrt] = useState(false);
  const [errText, setErrorText] = useState("");
  //value in params
  const listPlant = props.route.params.listPlant;

  //set value in screen
  const [model, setModel] = useState({});

  const [myPlant, setMyPlant] = useState([]);
  const [mode, setMode] = useState(props.route.params.mode);

  const _createArea = (text, index, id, item) => {
    if (text == "0") {
      console.log("can not type zero");
      setError(true);
      setErrorText("จำนวนพื้นที่ใส่มากกว่า 0 ");
    } else {
      const newPlant = [...listPlant];
      newPlant[index].allplants[id] = {
        ...newPlant[index].allplants[id],
        area: text,
      };
      setMyPlant(newPlant);
    }
    // console.log(newPlant[index].allplants[id])
    // ใส่พื้นที่ปลูก ในหมวดหมู่ เพราะโมเดลที่หามา ไม่ระบุว่า ปลูกกี่ไร่ในแต่ะต้น
    // newPlant[id] = { ...newPlant[id], "area": text, type:item.type,allplants:item.allplants };

    //เลือกจำนวนไร่ตามพืชที่ปลูก
  };

  const _model = (value) => {
    setModel(value);
  };

  //เช็คข้อมูลก่อนจะส่งให้ หน้า ผลลัพธ์
  const _checkArea = () => {
    // เอา ค่า undefined ออก
    const data = myPlant.filter((element) => {
      return element.allplants.length > 0;
    });

    const totalArea = data.reduce((sum, item) => {
      item.allplants.map((val, index) => {
        sum += parseInt(val.area);
      });
      return sum;
    }, 0);

    console.log(data, totalArea, parseInt(props.map.data.area.areaUnit));
    try {
      //เช็คพื้นที่ของ พื้นที่ custom กับ พื้นที่ของตัวเอง
      if (isNaN(totalArea)) {
        console.log("cannot");
        setError(true);
        setErrorText("กรุณาใส่พื้นที่ให้ครบหรือใส่พื้นที่มากกว่า 0");
      } else if (totalArea == 0) {
        setError(true);
        setErrorText("กรุณาใส่พื้นที่ให้ครบหรือใส่พื้นที่มากกว่า 0");
      } else if (parseInt(props.map.data.area.areaUnit) < totalArea) {
        setError(true);
        setErrorText("จำนวนที่ปลูกเกินจำนวนไร่ที่มี");
      } else {
        const data = myPlant.filter((element) => {
          return element.allplants.length > 0;
        });
        // เช็คพื้นที่ของ model กับ พื้นที่ของเรา
        // parseInt(props.map.data.area.areaUnit) < parseInt(model.totalArea)
        if (mode == "old" && Object.keys(model).length == 0) {
          setAlrt(!alrt);
        } else {
          props.UserPlant({
            result: mode == "old" ? model : data,
            mode: mode,
          });
          props.navigation.navigate("planting");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const hideAlert = () => {
    setAlrt(false);
  };

  const _categoryCheck = (item, index) => {
    if (item.allplants.length > 0) {
      return (
        <View key={index}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <Text style={[styles.text, { color: "black" }]}>{item.type}</Text>
          </View>
          {item.allplants.map((val, idx) => {
            return (
              <View
                key={idx}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: "5%",
                  marginVertical: "3%",
                }}
              >
                <Text style={styles.text}>{val.name}</Text>
                <View style={{ width: "40%", flexDirection: "row" }}>
                  <TextInput
                    style={{
                      fontSize: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "#707070",
                      fontFamily: "Sukhumvit",
                      width: "50%",
                    }}
                    returnKeyType={"done"}
                    keyboardType={"number-pad"}
                    textAlign={"center"}
                    // placeholder={type == "model" ? item.item.area + "" : "จำนวน"}
                    placeholderTextColor={"#C7C7C7"}
                    onChangeText={(text) => _createArea(text, index, idx, item)}
                  ></TextInput>
                  <View
                    style={{
                      borderRadius: 5,
                      flex: 1,
                      backgroundColor: "#E7E9DF",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Text style={styles.text}>ไร่</Text>
                    {/* <Ionicons name="ios-arrow-down" size={15} color="#707070" /> */}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <MainLayout
      {...props}
      title={"กรอกจำนวนพื้นที่ไร่"}
      isBack={true}
      header={true}
      isClose={true}
    >
      <AlertText
        hideAlert={() => hideAlert()}
        show={alrt}
        title="เกิดข้อผิดพลาด"
        alertText={"กรุณาเลือกโมเดลต้นแบบ"}
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
            flexDirection: "column",
          }}
        >
          <View style={{ flex: 0.5, flexDirection: "row" }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: mode == "old" ? "#929F5D" : "#E7E7DE",
                justifyContent: "center",
                flexDirection: "column",
                borderRadius: 10,
                marginHorizontal: 10,
                marginVertical: 20,
              }}
              onPress={() => setMode("old")}
            >
              <Image
                source={
                  mode == "old"
                    ? require("../../assets/images/customarea-white.png")
                    : require("../../assets/images/customarea.png")
                }
                style={{
                  width: 50,
                  height: 50,
                  alignSelf: "center",
                }}
              ></Image>
              <Text
                style={[
                  styles.text,
                  { color: mode == "old" ? "#FFFFFF" : "#707070" },
                ]}
              >
                โมเดลพืชที่สำเร็จ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: mode == "custom" ? "#929F5D" : "#E7E7DE",
                justifyContent: "center",
                flexDirection: "column",
                borderRadius: 10,
                marginHorizontal: 10,
                marginVertical: 20,
              }}
              onPress={() => setMode("custom")}
            >
              <Image
                source={
                  mode == "custom"
                    ? require("../../assets/images/oldmodel-white.png")
                    : require("../../assets/images/oldmodel.png")
                }
                style={{
                  width: 50,
                  height: 50,
                  alignSelf: "center",
                }}
              ></Image>
              <Text
                style={[
                  styles.text,
                  { color: mode == "custom" ? "#FFFFFF" : "#707070" },
                ]}
              >
                ปรับแต่งพื้นที่เอง
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: "white", flex: 1 }}>
            {mode == "old" ? (
              <Model {...props} _model={(value) => _model(value)}></Model>
            ) : (
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#E7E7DE",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    backgroundColor: "#E7E7DE",
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#896C49",
                      fontSize: 16,
                      fontFamily: "Sukhumvit",
                    }}
                  >
                    รายชื่อพืชที่เลือก :
                  </Text>
                  <Text
                    style={{
                      color: "#896C49",
                      fontSize: 16,
                      fontFamily: "Sukhumvit",
                    }}
                  >
                    ขนาดแปลง :
                  </Text>
                </View>
                <ScrollView>
                  {listPlant.map((item, index) => {
                    return _categoryCheck(item, index);
                  })}
                </ScrollView>
                <View style={{ flex: 3 }}>
                  {error ? (
                    <Text style={styles.errorText}>{errText}</Text>
                  ) : null}
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Button
              style={{
                alignSelf: "center",
                flex: 1,
                justifyContent: "center",
                borderRadius: 10,
              }}
              success
              onPress={() => _checkArea()}
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

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  map: store.userMapState.map,
});

const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      UserPlant,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(AreaScreen);

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
    alignSelf: "center",
  },
  errorText: {
    fontFamily: "Sukhumvit",
    fontSize: 16,
    alignSelf: "flex-end",
    marginTop: 10,
    color: "#E64C3C",
  },
});
