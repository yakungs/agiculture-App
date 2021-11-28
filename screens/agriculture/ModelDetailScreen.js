import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList
} from "react-native";
import MainLayout from "../../components/layout/MainLayout";
import ProfilePic from "../../components/common/Item/ProfilePic";
import { AntDesign, Fontisto } from "@expo/vector-icons";

export default function index(props) {
  const item = props.route.params.item;


  //   const _followUser = () => [
  //     // console.log("currentUser :", firebase.auth().currentUser.uid, "anotherUID :", user.user.id)
  //     firebase.firestore().collection('following').doc(firebase.auth().currentUser.uid).collection('userFollowing').doc(user.user.id).set(user.user),
  //     firebase.firestore().collection('users').doc(user.user.id).collection('likes').doc(firebase.auth().currentUser.uid).set({})
  // ]

  // const _unFollowUser = () => {
  //     firebase.firestore().collection('following').doc(firebase.auth().currentUser.uid).collection('userFollowing').doc(user.user.id).delete();
  //     firebase.firestore().collection('users').doc(user.user.id).collection('likes').doc(firebase.auth().currentUser.uid).delete()
  // }

  const renderItem = (item) => {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: '5%', backgroundColor: '#EFEFE7', borderRadius: 10 }}>
          <View style={{ height: 150, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.text}>{item.item.name}</Text>
            <Image
              source={{uri:item.item.icon}}
              style={{
                width: 60,
                height: 60,
                alignSelf: "center",
                marginHorizontal: 10,
              }}
            ></Image>
          </View>
          <View style={{ width: "100%", alignItems: 'center', backgroundColor: '#E1DDD6', borderBottomRightRadius: 10, borderBottomLeftRadius: 10, padding: 10 }}>
            <Text style={styles.text}>{item.item.area} ไร่</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <MainLayout
      {...props}
      title={"ข้อมูลผู้ใช้"}
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
                  item.imageURL
                    ? { uri: item.imageURL }
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
                paddingHorizontal: 10
              }}
            >
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ flex: 0.5, borderBottomWidth: 1 }}>
                  <Text style={styles.text}>{item.name}</Text>
                </View>
                {/* <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <Text>โพสต์: 10 ตอบ: 20</Text>
                                </View> */}
                <View style={{ flex: 1, flexDirection: 'row', marginTop: "2%" }}>
                  <View style={{ marginRight: 5, marginTop: 5 }}>
                    <AntDesign name="hearto" size={15} color="#896C49" />
                  </View>
                  <Text style={styles.LikeText}>
                    {item.popularity}
                  </Text>

                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', paddingHorizontal: 20, alignItems: 'center', paddingVertical: 10 }}>
          <Text style={styles.text}>ขนาดพื้นที่ไร่ :</Text>
          <Text style={styles.text}>{item.totalArea ? item.totalArea + " ไร่" : "ผู้ใช้ไม่ได้ปลูกพืช"}</Text>
        </View>
        <ScrollView style={{
          flex: 10,
          backgroundColor: "white",
          borderRadius: 10,
          padding: 20,
        }}>
          {item.plant && item.plant.length > 0 ?
            item.plant.map((itm, index) => {
              return (
                <View key={index}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.text}>{itm.type + " :"}</Text>
                  </View>
                  <FlatList
                    data={itm.allplants}
                    renderItem={renderItem}
                    keyExtractor={(itm) => itm.id}
                    numColumns={2}
                  />
                </View>
              )
            })
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={styles.text}>"ไม่มีพืชที่ปลูกในเวลานี้"</Text></View>}
        </ScrollView>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  areaText: {
    fontSize: 16,
    color: "#707070",
    fontFamily: "Sukhumvit",
    paddingHorizontal: "10%",
  },
  name: {
    fontSize: 18,
    color: "#896C49",
    fontFamily: "Sukhumvit",
  },
  plantText: {
    fontSize: 16,
    color: "#707070",
    fontFamily: "Sukhumvit",
  },
  LikeText: {
    marginTop: 5,
    color: "#896C49",
    fontFamily: "Sukhumvit",
    marginRight: 20,
  },
  text: {
    color: "#896C49",
    fontFamily: "Sukhumvit",
    fontSize: 16,
  },

});
