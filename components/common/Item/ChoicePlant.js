import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

export default function ChoicePlant(props) {
  const [plants, setPlants] = useState([
    {
      plant: "ข้าว",
      select: "false",
    },
    { plant: "มะกรูด", select: "false" },
    { plant: "ตะไคร้", select: "false" },
  ]);
  const _select = (name) => {
    props._checkRec(plants[0].select);
    const newPlants = plants.map((item) => {
      if (item.plant === name) {
        const updatedItem = {
          ...item,
          select: !item.select,
        };

        return updatedItem;
      }

      return item;
    });

    setPlants(newPlants);
  };
  return (
    <View style={{ marginVertical: 15 }}>
      <View
        style={{
          borderTopWidth: 1,
          flexDirection: "column",
          borderBottomWidth: 1,
          borderColor: "#32cd32",
          //   opacity: 0.5,
          paddingVertical: 10,
          //   marginTop: 20,
          width: "90%",
          alignSelf: "center",
        }}
      >
        <ScrollView>
          {plants.map((item, idx) => {
            return (
              <View
                key={idx}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.text}>{item.plant}</Text>
                  <TextInput
                    style={{
                      fontSize: 15,
                      opacity: 0.5,
                      borderBottomWidth: 1,
                      marginBottom: 20,
                      marginRight: 10,
                    }}
                    keyboardType={"number-pad"}
                    placeholder={"จำนวนไร่"}
                    placeholderTextColor={"gray"}
                  ></TextInput>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    _select(item.plant);
                  }}
                >
                  {item.select ? (
                    <Feather name="square" size={24} color="green" />
                  ) : (
                    <AntDesign name="checksquareo" size={24} color="green" />
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContain: {
    // alignSelf: "center",
    marginTop: 15,
    padding: 20,
    backgroundColor: "#00fa9a",
    flexDirection: "column",
    borderRadius: 10,
    // width: aspectRatio > 1.6 ? wp("90%") : "40%",
  },
  text: {
    color: "green",
    fontSize: 15,
  },
});
