import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import RecCard from "../Item/RecCard";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function SelectModelScreen(props) {
  const [person, setPerson] = useState([]);
  const area = useSelector((store) => store.userMapState.map);
  // console.log(parseInt(area.data.area.areaUnit));
  useEffect(() => {
    var didCancel = false;
    if (!didCancel) {
      firebase
        .firestore()
        .collection("models")
        .where("totalArea", "<=", parseInt(area.data.area.areaUnit))
        .get()
        .then((item) => {
          const data = item.docs.map((value) => {
            const data = value.data();
            const id = value.id;
            return { id, ...data };
          });

          setPerson(data);
        });
    }
    return () => (didCancel = true);
  }, []);

  const [model, setModel] = useState(
    props.model == undefined ? {} : props.model
  );

  useEffect(() => {
    props._model(model);
  });

  const _selectModel = (value) => {
    setModel(value);
  };

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
        <View style={{ backgroundColor: "#E7E7DE", padding: 10 }}>
          <Text style={styles.text}>โมเดลต้นแบบ :</Text>
        </View>
        <ScrollView>
          {person.map((item, index) => {
            return (
              <RecCard
                key={index}
                item={item}
                {...props}
                _selectModel={(value) => {
                  _selectModel(value);
                }}
                model={model}
              ></RecCard>
            );
          })}
        </ScrollView>
      </View>
    </View>
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
