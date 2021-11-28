import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { Card, CardItem } from "native-base";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import _uniqueId from "lodash/uniqueId";
//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function PostBox(props) {
  const [question, setQuestion] = useState("");
  const [flag, setFlag] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoad] = useState(false);

  //upload Image
  const _uploadImage = async () => {
    //if image not exist
    if (image) {
      setLoad(true);
      const uri = image;
      const path = `posts/${
        firebase.auth().currentUser.uid
      }/${Math.random().toString(36)}`;
      const response = await fetch(uri);
      const blob = await response.blob();
      const task = firebase.storage().ref().child(path).put(blob);
      const taskProgress = (snapshot) => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      };

      const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
          savePostData(snapshot);
          console.log(snapshot);
        });
      };

      const taskError = (snapshot) => {
        console.log(snapshot);
      };

      task.on("state_changed", taskProgress, taskError, taskCompleted);
    } else {
      setLoad(true);
      savePostData("NOT EXIST");
    }
  };

  //Save Data
  const savePostData = (downloadURL) => {
    const post = {
      imageURL: downloadURL,
      question: question,
      creation: firebase.firestore.FieldValue.serverTimestamp(),
      likes: 0,
      commentCount: 0,
      user: props.currentUser,
    };

    //for post and comment condition
    if (props.postType == "post") {
      firebase.firestore().collection("allposts").add(post);
      // firebase
      //   .firestore()
      //   .collection("communications")
      //   .doc(firebase.auth().currentUser.uid)
      //   .collection("userPosts")
      //   .add(post);
      setQuestion("");
      setImage(null);
      setLoad(false);
    } else {
      const comment = {
        imageURL: downloadURL,
        question: question,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
        likes: 0,
        user: props.currentUser,
      };
      _Comment(comment);
    }
  };

  //post
  const _Post = () => {
    if (question == "") {
      console.log("can't Post");
    } else {
      _uploadImage();
    }
  };

  //fuction for comment
  const _Comment = (comment) => {
    firebase
      .firestore()
      .collection("allposts")
      .doc(props.item.id)
      .get()
      .then((snapshot) => {
        console.log(snapshot.data());
        // firebase
        //   .firestore()
        //   .collection("allposts")
        //   .doc(props.item.id)
        //   .get()
        //   .then((snapshot) => {
        firebase
          .firestore()
          .collection("allposts")
          .doc(props.item.id)
          .update({ commentCount: snapshot.data().commentCount + 1 });
        //   });
      });
    firebase
      .firestore()
      .collection("allposts")
      .doc(props.item.id)
      .collection("comments")
      .add(comment);
    setQuestion("");
    setImage(null);
    setLoad(false);
  };

  //Pick Image from Gallerry
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  if (loading) {
    return <ActivityIndicator size="small" color="#0000ff" />;
  }

  return (
    <Card style={styles.container}>
      <CardItem style={styles.containerItem}>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              paddingBottom: "2%",
            }}
          >
            <TextInput
              style={{ flex: 1, opacity: 0.5 }}
              placeholder={"แลกเปลี่ยนความคิดเห็น"}
              placeholderTextColor="black"
              onChangeText={(text) => setQuestion(text)}
              value={question == "" ? "" : question}
            ></TextInput>
            <View
              style={{
                borderRadius: 100,
                width: 60,
                height: 40,
              }}
            >
              <Image
                source={{ uri: props.currentUser.imageURL }}
                style={{
                  flex: 1,
                  alignSelf: "stretch",
                  borderRadius: 40,
                  width: 40,
                }}
              ></Image>
            </View>
          </View>
          {image ? (
            <View
              style={{
                alignSelf: "flex-end",
                padding: 10,
              }}
            >
              <Image
                source={{ uri: image ? image : null }}
                style={{
                  alignSelf: "stretch",
                  width: 60,
                  height: 60,
                }}
              ></Image>
            </View>
          ) : null}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
            }}
          >
            <View style={{ flex: 0.2 }} />
            <View style={{ flex: 1, flexDirection: "row", marginTop: "5%" }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#BEAD9A",
                  borderRadius: 5,
                  paddingVertical: 5,
                  marginRight: 5,
                }}
                onPress={() => {
                  pickImage();
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Sukhumvit",
                      color: "#FFFFFF",
                    }}
                  >
                    {"เพิ่มรูปภาพ"}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#B1BF79",
                  borderRadius: 5,
                  paddingVertical: 5,
                }}
                onPress={() => {
                  _Post();
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Sukhumvit",
                      color: "#FFFFFF",
                    }}
                  >
                    {props.postType == "comments" ? "แสดงความคิด" : "โพสต์"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CardItem>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F2EF",
    borderRadius: 10,
    flex: 0.2,
  },
  containerItem: {
    backgroundColor: "#F2F2EF",
    borderRadius: 10,
    flex: 1,
  },
  text: {
    color: "#896C49",
    fontFamily: "Sukhumvit",
    alignSelf: "flex-end",
    marginLeft: "5%",
    fontSize: 10,
  },
});
