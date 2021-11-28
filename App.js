import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { Root } from "native-base";
import AppLoading from "expo-app-loading";

//firebase
import * as firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyB_ppODCcfRZpMVS4KuHjfv-boAHJl-oJM",
  authDomain: "finalproject-f2df9.firebaseapp.com",
  projectId: "finalproject-f2df9",
  storageBucket: "finalproject-f2df9.appspot.com",
  messagingSenderId: "588825767374",
  appId: "1:588825767374:web:978c5261959c7fb6518f9f",
  measurementId: "G-PD2HVH2B7T",
};

//menu popup
import { MenuProvider } from "react-native-popup-menu";

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  //firebase setting
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  useEffect(() => {
    async function fetchData() {
      await Font.loadAsync({
        Sukhumvit: require("./assets/fonts/SukhumvitSet-Medium.ttf"),
      });
      setFontLoaded(true);
    }
    fetchData();
  }, []);
  if (!isLoadingComplete) {
    return null;
  } else {
    if (!fontLoaded) {
      return (
        <Root>
          <AppLoading />
        </Root>
      );
    } else {
      return (
        <MenuProvider>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            {/* <StatusBar /> */}
          </SafeAreaProvider>
        </MenuProvider>
      );
    }
  }
}
