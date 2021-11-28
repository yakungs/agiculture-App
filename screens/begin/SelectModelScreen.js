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
import ChoiceScreen from "../begin/ChoiceScreen";

import { Button } from "native-base";
import RecCard from "../../components/common/Item/RecCard";
import { ScrollView } from "react-native-gesture-handler";

export default function SelectModelScreen(props) {
  const form = props.route.params.item;
  const type = props.route.params.type;
  const [person, setPerson] = useState([
    {
      name: "คาซูยา โคมัทซึ",
      area: 10,
      like: 100,
      plant: [
        {
          id: 1,
          name: "ข้าว",
          area: 5,
        },
        {
          id: 2,
          name: "มะม่วง",
          area: 5,
        },
      ],
    },
    {
      name: "คุณวรินทร์ ",
      area: 8,
      like: 80,
      plant: [
        {
          id: 1,
          name: "ข้าวโพด",
          area: 4,
        },
        {
          id: 2,
          name: "ส้ม",
          area: 3,
        },
        {
          id: 3,
          name: "มันฝรั่ง",
          area: 1,
        },
      ],
    },
    {
      name: "คุณสุกัญญา",
      area: 5,
      like: 60,
      plant: [
        {
          id: 1,
          name: "ข้าว",
          area: 3,
        },
        {
          id: 2,
          name: "ทุเรียน",
          area: 1,
        },
        { id: 3, name: "แอปเปิ้ล", area: 1 },
      ],
    },
  ]);
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
          <View>
            <Text style={styles.text}>ผลงานที่แนะนำ :</Text>
          </View>
          <ScrollView>
            {person.map((item, index) => {
              return (
                <RecCard
                  key={index}
                  item={item}
                  {...props}
                  form={form}
                  type={type}
                ></RecCard>
              );
            })}
          </ScrollView>
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
              }}
              warning
              onPress={() => props.navigation.pop()}
            >
              <Text style={{ color: "#FBFBFB", fontFamily: "Sukhumvit" }}>
                ย้อนกลับ
              </Text>
            </Button>z
          </View>
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00fa9a",
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: 500,
  },
  text: {
    color: "#707070",
    fontFamily: "Sukhumvit",
    fontSize: 16,
  },
});
