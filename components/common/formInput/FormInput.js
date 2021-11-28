import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

export default function FormInput(props) {
  return (
    <View>
      <Text style={styles.text}>
        {props.title}
        {props.isRequire ? <Text style={{ color: "red" }}> *</Text> : null}
      </Text>
      <TextInput
        style={{
          
          fontSize: 14,
          opacity: 0.5,
          borderBottomWidth: 1,
          marginBottom: 10,
          marginLeft: 15,
          borderBottomColor: "#707070",
          fontFamily: "Sukhumvit",
        }}
        maxLength={props.maxLength}
        returnKeyType={ 'done' }
        keyboardType={props.keyboardType}
        editable={props.editable}
        onChangeText={(text) => props._formInput(text)}
        placeholder={props.placeholder}
        placeholderTextColor={"#707070"}
        secureTextEntry={props.secureTextEntry}
      ></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Sukhumvit",
    color: "#707070",
  },
});
