import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import { Card, CardItem } from "native-base";
import PostBox from "../../components/common/itemBox/PostBox";
import Post from "../../components/common/feed/Post";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeablePanel } from "rn-swipeable-panel";
//firebase
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersFollowingLikes } from "../../redux/actions/index";

function FeedScreen(props) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(1);
  const [sort, setSort] = useState("creation");
  const [search, setSearch] = useState("");
  const user = props.route.params.user;
  React.useEffect(() => {
    var didCancel = false;
    if (!didCancel) {
      firebase
        .firestore()
        .collection("allposts")
        .where("user.id", "==", user.id)
        // .orderBy(sort, "desc")
        // .limit(pagination)
        .get()
        .then((user) => {
          const post = user.docs.map((value) => {
            const data = value.data();
            const id = value.id;
            return { id, ...data };
          });

          setUsers(
            post.filter((item) => {
              return item.user.name.match(search);
            })
          );
        });
    }
    return () => (didCancel = true);
  }, [users]);

  //   const _loadPagination = () => {
  //     setPagination(pagination + 1);
  //   };

  //   const [panelProps, setPanelProps] = useState({
  //     fullWidth: true,
  //     // openLarge: false,
  //     noBackgroundOpacity: true,
  //     showCloseButton: true,
  //     onlySmall: true,
  //     closeOnTouchOutside: true,
  //     onClose: () => closePanel(),
  //     onPressCloseButton: () => closePanel(),
  //   });
  //   const [isPanelActive, setIsPanelActive] = useState(false);
  //   const openPanel = () => {
  //     setIsPanelActive(true);
  //   };
  //   const closePanel = () => {
  //     setIsPanelActive(false);
  //   };

  return (
    <MainLayout
      {...props}
      title={"โพสต์ของผู้ใช้"}
      isBack={true}
      header={true}
      //   isSort={true}
      //   openPanel={() => openPanel()}
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
            flex: 6,
            backgroundColor: "white",
            borderRadius: 10,
            marginTop: 10,
            padding: 20,
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          >
            <ScrollView
            // onScroll={() => _loadPagination()}
            // throttleScrollCallbackMS={16}
            >
              {users.map((item, index) => {
                return (
                  <Post
                    key={index}
                    item={item}
                    currentUser={props.currentUser}
                    navigation={props.navigation}
                  ></Post>
                );
              })}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <View style={{ flex: 0.2 }}></View>
      </View>
      {/* <SwipeablePanel
        style={{
          // borderWidth: 1,
          justifyContent: "center",
          height: Platform.OS == "ios" ? 450 : 750,
          backgroundColor: "#C6C7B8",
        }}
        {...panelProps}
        isActive={isPanelActive}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            // justifyContent: "center",
            // alignItems: "center",
            marginTop: 15,
            // borderWidth: 1,
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: "center",
              width: "50%",
              flexDirection: "row",
              // borderWidth: 1,
              marginBottom: 15,
            }}
            onPress={() => setSort("creation")}
          >
            <Ionicons
              name="time-outline"
              style={{ marginRight: 10 }}
              size={24}
              color="#707070"
            />
            <Text style={styles.swipeText}>เรียงตามเวลา</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: "center",
              width: "50%",
              flexDirection: "row",
              // borderWidth: 1,
              marginBottom: 15,
            }}
            onPress={() => setSort("likes")}
          >
            <AntDesign
              name="hearto"
              style={{ marginRight: 10 }}
              size={24}
              color="#707070"
            />
            <Text style={styles.swipeText}>เรียงตามจำนวนที่ถูกใจ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: "center",
              width: "50%",
              flexDirection: "row",
              // borderWidth: 1,
            }}
            onPress={() => setSort("commentCount")}
          >
            <MaterialCommunityIcons
              name="message-reply"
              size={24}
              style={{ marginRight: 10 }}
              color="#707070"
            />
            <Text style={styles.swipeText}>เรียงตามจำนวนการตอบกลับ</Text>
          </TouchableOpacity>
        </View>
      </SwipeablePanel> */}
    </MainLayout>
  );
}

const mapStateToProps = (store) => ({
  usersData: store.usersState.usersData,
  currentUser: store.userState.currentUser,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators(
    {
      fetchUsersFollowingLikes,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchProps)(FeedScreen);

const styles = StyleSheet.create({
  HeaderText: {
    fontSize: 16,
    color: "#896C49",
    fontFamily: "Sukhumvit",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    color: "#896C49",
    fontFamily: "Sukhumvit",
  },
  WeatherText: {
    fontSize: 10,
    color: "#3B3B3B",
    fontFamily: "Sukhumvit",
  },
  CelsiusText: {
    fontSize: 30,
    color: "#3B3B3B",
    fontFamily: "Sukhumvit",
    alignSelf: "center",
  },
  LikeText: {
    alignSelf: "flex-end",
    marginTop: 10,
    color: "#896C49",
    fontFamily: "Sukhumvit",
    marginRight: 10,
  },
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
  swipeText: {
    color: "#707070",
    fontSize: 15,
    fontFamily: "Sukhumvit",
  },

  text: {
    color: "#896C49",
    fontFamily: "Sukhumvit",
  },
});
