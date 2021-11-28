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
  apiKey: "<<API key>>",
  authDomain: "<<API key>>",
  projectId: "<<API key>>",
  storageBucket: "<<API key>>",
  messagingSenderId: "<<API key>>",
  appId: "<<API key>>",
  measurementId: "<<API key>>",
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
