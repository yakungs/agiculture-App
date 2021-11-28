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
import PostBox from "../itemBox/PostBox";
import Comment from "../feed/Comment";

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

export default function Post(props) {
  const [edit, setEdit] = useState(false);

  const [hide, setHide] = useState(false);
  const [reply, setReply] = useState([]);
  const [question, setQuestion] = useState("");
  const [show, setShow] = useState(false);

  React.useEffect(() => {
    var didCancel = false;
    if (!didCancel) {
      firebase
        .firestore()
        .collection("allposts")
        .doc(props.item.id)
        .collection("comments")
        .orderBy("creation", "desc")
        .get()
        .then((c) => {
          const comments = c.docs.map((val) => {
            const data = val.data();
            const id = val.id;
            return { id, ...data };
          });
          comments.sort((x, y) => {
            return x.creation - y.creation;
          });
          setReply(comments);
        });
    }
    return () => (didCancel = true);
  }, [reply]);

  //check for leght text
  const _checkLengthTxt = (name) => {
    name = name == null ? "" : name;
    if (name.length > 13) {
      return name.substring(0, 13) + "...";
    }
    return name;
  };

  //delete Post
  const _deletePost = () => {
    firebase.firestore().collection("allposts").doc(props.item.id).delete();
  };

  //like Posts
  const _likePost = (PostId) => {
    firebase
      .firestore()
      .collection("allposts")
      .doc(PostId)
      .collection("likes")
      .doc(props.currentUser.id)
      .set({})
      .then(() => {
        firebase
          .firestore()
          .collection("allposts")
          .doc(PostId)
          .collection("likes")
          .get()
          .then((snapshot) => {
            firebase
              .firestore()
              .collection("allposts")
              .doc(PostId)
              .update({ likes: snapshot.size });
          });
      });
  };

  //edit Post
  const _editPost = (PostId) => {
    firebase
      .firestore()
      .collection("allposts")
      .doc(PostId)
      .update({
        question: question,
      })
      .then(() => {
        setEdit(false);
      });
  };

  return (
    <View>
      <Card style={styles.container}>
        <CardItem style={styles.containerItem}>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
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
                    props.navigation.navigate("another", { user: props.item.user })
                  }
                >
                  <Image
                    source={{ uri: props.item.user.imageURL }}
                    style={{
                      flex: 1,
                      borderRadius: 40,
                      width: 40,
                    }}
                  ></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("another", { user: props.item.user })
                  }
                >
                  <Text style={styles.text}>{props.item.user.name}</Text>
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
                    <MenuOption onSelect={() => setEdit(!edit)}>
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
                    <MenuOption onSelect={() => _deletePost()}>
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
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <TextInput
                  numberOfLines={2}
                  editable={props.item.user.id == props.currentUser.id && edit}
                  style={[
                    styles.text,
                    {
                      marginHorizontal: "8%",
                      borderColor:
                        props.item.user.id == props.currentUser.id && edit
                          ? "black"
                          : null,
                      borderWidth:
                        props.item.user.id == props.currentUser.id && edit
                          ? 1
                          : 0,
                    },
                  ]}
                  multiline={true}
                  onChangeText={(text) => {
                    setQuestion(text);
                  }}
                >
                  {props.item.question}
                </TextInput>
                {props.item.imageURL == "NOT EXIST" ? null : (
                  <View
                    style={{
                      borderRadius: 100,
                      width: 200,
                      height: 200,
                      alignSelf: "center",
                    }}
                  >
                    <Image
                      source={{ uri: props.item.imageURL }}
                      style={{
                        flex: 1,
                        width: 200,
                      }}
                    ></Image>
                  </View>
                )}
                {props.item.user.id == props.currentUser.id && edit ? (
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
                        setEdit(false);
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
                        _editPost(props.item.id);
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
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: "#B1BF79",
              borderBottomLeftRadius: 10,
              marginRight: "1%",
              padding: "1.5%",
            }}
            onPress={() => {
              _likePost(props.item.id);
            }}
          >
            <EvilIcons name="heart" size={24} color="#FFFFFF" />
            <Text style={[styles.text, { color: "#FFFFFF" }]}>
              {props.item.likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: "#B1BF79",
              borderBottomRightRadius: 10,
              padding: "1.5%",
            }}
            onPress={() => {
              setHide(!hide);
            }}
          >
            <Text style={[styles.text, { color: "#FFFFFF" }]}>
              แสดงความคิดเห็น
            </Text>
          </TouchableOpacity>
        </View>
      </Card>
      <View
        style={{
          borderColor: "#CECECE",
          borderLeftWidth: 2,
          paddingLeft: "5%",
          marginLeft: "10%",
          borderRadius: 1,
        }}
      >
        {hide ? (
          <PostBox
            postType="comments"
            currentUser={props.currentUser}
            item={props.item}
          ></PostBox>
        ) : null}
        {show
          ? reply.map((comment, index) => {
              return (
                <Comment
                  key={index}
                  comment={comment}
                  item={props.item}
                  navigation={props.navigation}
                  currentUser={props.currentUser}
                ></Comment>
              );
            })
          : reply.slice(0, 2).map((comment, index) => {
              return (
                <Comment
                  key={index}
                  navigation={props.navigation}
                  comment={comment}
                  item={props.item}
                  currentUser={props.currentUser}
                ></Comment>
              );
            })}
        {reply.length > 2 ? (
          <TouchableOpacity
            style={{ flex: 1, alignSelf: "flex-end" }}
            onPress={() => {
              setShow(!show);
            }}
          >
            <Text style={styles.text}>
              {show ? ">> แสดงน้อยลง" : "<< แสดงทั้งหมด"}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
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
