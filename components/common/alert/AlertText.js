import React from "react";
import { View } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
export default function AlertText(props) {
  //   console.log(props.show);
  return (
    <View>
      <AwesomeAlert
        show={props.show}
        showProgress={false}
        title={props.title}
        message={props.alertText}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        // showCancelButton={true}
        showConfirmButton={true}
        // cancelText="No, cancel"
        confirmText="ตกลง"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          props.hideAlert();
        }}
        onConfirmPressed={() => {
          props.hideAlert();
        }}
      />
    </View>
  );
}
