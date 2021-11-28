import React from "react";
import { View, StyleSheet, Image } from "react-native";

const CustomMarker = ({ item }) => {
  return (
    <View style={styles.roundMarker}>
      <Image
        style={styles.roundImage}
        source={require("../../../assets/images/arrow.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  roundMarker: {
    height: 30,
    width: 30,
    borderRadius: 25,
  },
  roundImage: {
    height: 30,
    width: 30,
    borderRadius: 25,
  },
});

export default CustomMarker;
