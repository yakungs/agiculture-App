import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Card, CardItem } from "native-base";
import { EvilIcons, AntDesign, FontAwesome } from "@expo/vector-icons";

//pop up
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function Comment(props) {
  const [editComment, setEditComment] = useState(false);
  const [question, setQuestion] = useState("");

  //check for leght text
  const _checkLengthTxt = (name) => {
    name = name == null ? "" : name;
    if (name.length > 13) {
      return name.substring(0, 13) + "...";
    }
    return name;
  };

  //delete comment
  const _deleteComment = (index) => {
    firebase
      .firestore()
      .collection("allposts")
      .doc(props.item.id)
      .collection("comments")
      .doc(index)
      .delete();
  };

  //like Comments
  const _likeComment = (PostId, CommentId) => {
    firebase
      .firestore()
      .collection("allposts")
      .doc(PostId)
      .collection("comments")
      .doc(CommentId)
      .collection("likes")
      .doc(props.currentUser.id)
      .set({})
      .then(() => {
        firebase
          .firestore()
          .collection("allposts")
          .doc(PostId)
          .collection("comments")
          .doc(CommentId)
          .collection("likes")
          .get()
          .then((snapshot) => {
            firebase
              .firestore()
              .collection("allposts")
              .doc(PostId)
              .collection("comments")
              .doc(CommentId)
              .update({ likes: snapshot.size });
            console.log(snapshot.size);
          });
      });
  };

  //edit comment
  const _editComment = (commentId, PostId) => {
    console.log("hello", commentId, PostId);
    firebase
      .firestore()
      .collection("allposts")
      .doc(PostId)
      .collection("comments")
      .doc(commentId)
      .update({
        question: question,
      })
      .then(() => {
        setEditComment(false);
      });
  };

  return (
    <Card style={styles.container}>
      <CardItem style={styles.containerItem}>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <View
            style={{
              flexDirection: "row",

              // justifyContent: "space-around",
            }}
          >
            <View style={{ flexDirection: "row", flex: 3 }}>
              <TouchableOpacity
                style={{
                  borderRadius: 100,
                  width: 40,
                  height: 40,
                  marginRight: "3%",
                }}
                onPress={() =>
                  props.navigation.navigate("another", { user: props.comment.user })
                }
              >
                <Image
                  source={{ uri: props.comment.user.imageURL }}
                  style={{
                    flex: 1,
                    borderRadius: 40,
                    width: 40,
                  }}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate("another", { user: props.comment.user })
                }
              >
                <Text style={styles.text}>
                  {_checkLengthTxt(props.comment.user.name)}
                </Text>
              </TouchableOpacity>
            </View>
            {props.item.user.id == props.currentUser.id ? (
              <Menu style={{}}>
                <MenuTrigger>
                  <Image
                    source={require("../../../assets/images/editIcon.png")}
                    style={{ width: 20, height: 20 }}
                  ></Image>
                </MenuTrigger>
                <MenuOptions
                  optionsContainerStyle={{
                    marginTop: "5%",
                    width: "30%",
                    backgroundColor: "#C6C7B8",
                    paddingHorizontal: "5%",
                    paddingVertical: "10%",
                    borderRadius: 20,
                  }}
                >
                  <MenuOption onSelect={() => setEditComment(!editComment)}>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <AntDesign
                        name="edit"
                        style={{ marginRight: "5%" }}
                        size={24}
                        color="#896C49"
                      />
                      <Text style={styles.text}>แก้ไข</Text>
                    </View>
                  </MenuOption>
                  <View style={styles.divider} />
                  <MenuOption onSelect={() => _deleteComment(props.comment.id)}>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <FontAwesome
                        name="trash-o"
                        style={{ marginRight: "5%" }}
                        size={24}
                        color="#896C49"
                      />
                      <Text style={styles.text}>ลบ</Text>
                    </View>
                  </MenuOption>
                  <View style={styles.divider} />
                </MenuOptions>
              </Menu>
            ) : null}
          </View>
          <View
            style={{
              flex: 1,
              marginTop: "3%",
            }}
          >
            <View style={{ flexDirection: "column", flex: 1 }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1.5 }}>
                  <TextInput
                    numberOfLines={2}
                    editable={
                      props.comment.user.id == props.currentUser.id &&
                      editComment
                    }
                    style={[
                      styles.text,
                      {
                        marginHorizontal: "8%",
                        borderColor:
                          props.comment.user.id == props.currentUser.id &&
                          editComment
                            ? "black"
                            : null,
                        borderWidth:
                          props.comment.user.id == props.currentUser.id &&
                          editComment
                            ? 1
                            : 0,
                      },
                    ]}
                    multiline={true}
                    onChangeText={(text) => {
                      setQuestion(text);
                    }}
                  >
                    {props.comment.question}
                  </TextInput>
                </View>
                <View style={{ flex: 0.5 }}>
                  <TouchableOpacity
                    style={{
                      height: 50,
                      justifyContent: "center",
                      padding: "5%",
                      backgroundColor: "#B1BF79",
                      borderRadius: 10,
                      marginTop: "2%",
                    }}
                    onPress={() => {
                      _likeComment(props.item.id, props.comment.id);
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                      }}
                    >
                      <EvilIcons name="heart" size={24} color="#FFFFFF" />
                      <Text style={[styles.text, { color: "#FFFFFF" }]}>
                        {props.comment.likes}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {props.comment.imageURL == "NOT EXIST" ? null : (
                <View
                  style={{
                    borderRadius: 100,
                    width: 100,
                    height: 100,
                  }}
                >
                  <Image
                    source={{ uri: props.comment.imageURL }}
                    style={{
                      flex: 1,
                      width: 100,
                    }}
                  ></Image>
                </View>
              )}

              {props.item.user.id == props.currentUser.id && editComment ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: "5%",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      backgroundColor: "#E0DED5",
                      marginRight: "1%",
                      padding: "1.5%",
                    }}
                    onPress={() => {
                      setEditComment(false);
                    }}
                  >
                    <Text style={[styles.text]}>ยกเลิก</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: "center",
                      backgroundColor: "#E0DED5",
                      padding: "1.5%",
                    }}
                    onPress={() => {
                      _editComment(props.comment.id, props.item.id);
                    }}
                  >
                    <Text style={[styles.text]}>แก้ไข</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
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
    flex: 1,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: "#E7E8DF",
    marginHorizontal: "10%",
  },
  containerItem: {
    backgroundColor: "#F2F2EF",
    borderRadius: 10,
    flex: 1,
  },
  text: {
    color: "#896C49",
    fontFamily: "Sukhumvit",
  },
});
