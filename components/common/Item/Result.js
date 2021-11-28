import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { AntDesign, Ionicons, Feather } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

export default function ChoicePlant(props) {
  const [plants, setPlants] = useState([
    {
      plant: "ไผ่",
      select: "false",
      number: 15,
    },
    { plant: "มะกรูด", select: "false", number: 1 },
    { plant: "ตะไคร้", select: "false", number: 12 },
  ]);
  const _select = (name) => {
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
                  <Text style={styles.text}>{item.number} ไร่ </Text>
                </View>
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
