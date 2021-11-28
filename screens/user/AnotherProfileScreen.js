import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import { AntDesign, Fontisto, SimpleLineIcons } from "@expo/vector-icons";
import { FlatList, ScrollView } from "react-native-gesture-handler";

//redux
import { connect } from "react-redux";

//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

function AnotherProfileScreen(props) {
  const [following, setFollowing] = useState(false);
  const [allFollow, setAllFollow] = useState();
  const [loading, setLoad] = useState(false);
  //another user id and item
  const user = props.route.params.user;

  useEffect(() => {
    var didCancel = false;
    if (!didCancel) {
      firebase
        .firestore()
        .collection("users")
        .doc(user.id)
        .collection("likes")
        .get()
        .then((snapshot) => {
          setAllFollow(snapshot.size);
        });

      const follow = props.following.findIndex((item) => {
        return item.id == user.id;
      });
      if (follow > -1) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    }
    return () => (didCancel = true);
  }, [props.following]);

  const _followUser = async () => {
    await firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(user.id)
      .set(user);
    await firebase
      .firestore()
      .collection("users")
      .doc(user.id)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({})
      .then(() => {
        setLoad(false);
      });
  };

  const _unFollowUser = async () => {
    await firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(user.id)
      .delete();
    await firebase
      .firestore()
      .collection("users")
      .doc(user.id)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete()
      .then(() => {
        setLoad(false);
      });
  };

  const renderItem = (item) => {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            margin: "5%",
            backgroundColor: "#EFEFE7",
            borderRadius: 10,
          }}
        >
          <View
            style={{
              height: 150,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.text}>{item.item.name}</Text>
            <Image
              source={{ uri: item.item.icon }}
              style={{
                width: 60,
                height: 60,
                alignSelf: "center",
                marginHorizontal: 10,
              }}
            ></Image>
          </View>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              backgroundColor: "#E1DDD6",
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              padding: 10,
            }}
          >
            <Text style={styles.text}>{item.item.area} ไร่</Text>
          </View>
        </View>
      </View>
    );
  };

  const _navigateToAnotherProfile = () => {
    console.log("hello");
    props.navigation.navigate("anotherPost", { user: user });
  };
  return (
    <MainLayout
      {...props}
      title={"ข้อมูลผู้ใช้งาน"}
      isBack={true}
      header={true}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          width: "90%",
        }}
      >
        <View
          style={{
            flex: 0.3,
            backgroundColor: "white",
            borderRadius: 10,
            marginTop: 10,
            padding: 20,
          }}
        >
          <View
            style={{
              flex: 5,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity>
              <Image
                source={
                  user.imageURL
                    ? { uri: user.imageURL }
                    : require("../../assets/images/user_avatar.png")
                }
                style={{
                  width: 100,
                  height: 100,
                  justifyContent: "center",
                  alignSelf: "center",
                  borderRadius: 50,
                }}
              ></Image>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                marginTop: 10,
                paddingHorizontal: 10,
              }}
            >
              <View style={{ flex: 1, flexDirection: "column" }}>
                <View style={{ flex: 0.5, borderBottomWidth: 1 }}>
                  <Text style={styles.text}>{user.name}</Text>
                </View>

                <View
                  style={{ flex: 1, flexDirection: "row", marginTop: "2%" }}
                >
                  <TouchableOpacity onPress={() => _navigateToAnotherProfile()}>
                    <Text style={styles.text}>โพสต์ของผู้ใช้</Text>
                  </TouchableOpacity>
                  {/* <View style={{ marginRight: 5 }}>
                    <AntDesign name="hearto" size={15} color="#896C49" />
                  </View> */}
                  {/* {loading ? <ActivityIndicator></ActivityIndicator> :<Text style={styles.LikeText}>{allFollow}</Text>} */}
                  {firebase.auth().currentUser.uid ==
                  user.id ? null : following ? (
                    <TouchableOpacity
                      style={{ flex: 1, alignItems: "flex-end" }}
                      onPress={() => _unFollowUser()}
                    >
                      <Image
                        source={require("../../assets/images/bookmark-brown.png")}
                        style={{
                          // resizeMode: "cover",
                          width: 20,
                          height: 20,
                        }}
                      ></Image>
                      {/* <Text>Following</Text> */}
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{ flex: 1, alignItems: "flex-end" }}
                      onPress={() => _followUser()}
                    >
                      <Image
                        source={require("../../assets/images/bookmark.png")}
                        style={{
                          // resizeMode: "cover",
                          width: 20,
                          height: 20,
                        }}
                      ></Image>
                      {/* <Text>Follow</Text> */}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-end",
            paddingHorizontal: 20,
            alignItems: "center",
            paddingVertical: 10,
          }}
        >
          <Text style={styles.text}>ขนาดพื้นที่ไร่ :</Text>
          <Text style={styles.text}>
            {user.totalArea ? user.totalArea + " ไร่" : "ผู้ใช้ไม่ได้ปลูกพืช"}
          </Text>
        </View>
        <ScrollView
          style={{
            flex: 10,
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
          }}
          // scrollEnabled={false}
        >
          {user.plant && user.plant.length > 0 ? (
            user.plant.map((item, index) => {
              return (
                <View key={index}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.text}>{item.type + " :"}</Text>
                  </View>
                  <FlatList
                    data={item.allplants}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    scrollEnabled={false}
                  />
                  {/* {item.allplants.map((val, idx) => {
                                        return (
                                            <View
                                                key={idx}
                                                style={{
                                                    flexDirection: "row",
                                                    justifyContent: "space-between",
                                                    marginHorizontal: "5%",
                                                    marginVertical: "3%",
                                                }}
                                            >
                                                <Text style={styles.text}>{val.name}</Text>
                                                <Text style={styles.text}>{val.area + " ไร่"}</Text>
                                            </View>
                                        )
                                    })} */}
                </View>
              );
            })
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.text}>"ไม่มีพืชที่ปลูกในเวลานี้"</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </MainLayout>
  );
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(AnotherProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00fa9a",
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: 500,
  },
  text: {
    color: "#896C49",
    fontFamily: "Sukhumvit",
    fontSize: 16,
  },
  LikeText: {
    color: "#896C49",
    fontFamily: "Sukhumvit",
  },
});
