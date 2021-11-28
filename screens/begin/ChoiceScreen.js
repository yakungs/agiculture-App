import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import { Button } from "native-base";
import Model from "../../components/common/choice/Model";
import Custom from "../../components/common/choice/Custom";
import AlertText from "../../components/common/alert/AlertText";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { UserPlant } from "../../redux/actions/index";

function ChoiceScreen(props) {
  const [mode, setMode] = useState("old");
  const [alrt, setAlrt] = useState(false);
  const [choose, setChoose] = useState([]);
  const [model, setModel] = useState({});

  const form = props.route.params.form;

  const _plant = (value) => {
    // console.log("hello",value)
    setChoose(value);
  };

  const _model = (value) => {
    setModel(value);
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

    try {
      if (mode == "old") {
        if (
          parseInt(props.map.data.area.areaUnit) < parseInt(model.totalArea)
        ) {
          setAlrt(!alrt);
        } else {
          if (Object.keys(model).length > 0) {
            props.UserPlant({ result: model, mode: mode });
            props.navigation.navigate("planting");
          } else {
            console.log("cant");
          }
        }
      } else {
        if (choose.length > 0) {
          props.navigation.navigate("area", {
            listPlant: format,
            mode: mode,
          });
        } else {
          console.log("cant");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const _checkUnit = (unit) => {
  //   try {
  //     if (unit == "ตารางวา") {
  //       return unit
  //     } else if (unit == "งาน") {

  //     } else if (unit == "") {

  //     } else {
  //       console.log("error")
  //     }

  //   } catch (error) {
  //     console.log(error)
  //   }

  // }

  const hideAlert = () => {
    setAlrt(false);
  };

  // console.log(props.map.data.area.areaUnit)

  return (
    <MainLayout
      {...props}
      title={"เลือกพืชที่จะปลูก"}
      isBack={true}
      header={true}
      isClose={true}
    >
      <AlertText
        hideAlert={() => hideAlert()}
        show={alrt}
        title="เกิดข้อผิดพลาด"
        alertText={"พื้นที่ของคุณน้อยกว่าโมเดลนี้"}
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
                  resizeMode: "contain",
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
              <Custom
                _plant={(value) => {
                  _plant(value);
                }}
              ></Custom>
            )}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
            }}
          >
            <Button
              style={{
                alignSelf: "center",
                flex: 1,
                justifyContent: "center",
                borderRadius: 10,
                backgroundColor:
                  choose.length > 0 || Object.keys(model).length > 0
                    ? "#929F5D"
                    : "#B1B4AD",
              }}
              success
              onPress={() => _savePlant()}
            >
              <Text style={{ color: "#FFFFFF", fontFamily: "Sukhumvit" }}>
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
      UserPlant,
    },
    dispatch
  );

const mapStateToProps = (store) => ({
  map: store.userMapState.map,
});

export default connect(mapStateToProps, mapDispatchProps)(ChoiceScreen);

const styles = StyleSheet.create({
  text: {
    color: "#707070",
    fontFamily: "Sukhumvit",
    fontSize: 15,
    alignSelf: "center",
  },
});
