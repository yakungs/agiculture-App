import firebase from "firebase";
import {
  USER_STATE_CHANGE,
  USER_PLANT,
  USER_FOLLOWING,
  PLANT_DATA,
  USER_MAP,
  USER_LOCATION,
} from "../constants/index";

export const FetchUser = () => {
  return async (dispatch) => {
    await firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((value) => {
        if (value.exists) {
          const data = value.data();
          const id = value.id;
          dispatch({
            type: USER_STATE_CHANGE,
            currentUser: { id, ...data },
          });
        } else {
          console.log("DOES NOT EXIST");
        }
      });
  };
};

// //           ชื่อฟังก์ชัน   ค่าที่ส่งเข้ามา(ส่วนใหญ่พี่จะส่งข้อมูลจาก api มา)
// export const getData = (data) => {
//               //dispatch คือ ตัวที่ไว้ติดต่อกับ reducer
//   return async (dispatch) => {
//     dispatch({
//       //    type นี้จะไว้เช็คตอนเข้า reducer ส่วน ตรง map(เปลี่ยนชื่อได้นะ) ข้อมูลที่ต้องการเก็บ)ใน redux
//       type: USER_MAP,
//       map: {
//         data,
//       },
//     });
//   };
// };

export const UserMap = (data) => {
  return async (dispatch) => {
    dispatch({
      type: USER_MAP,
      map: {
        data,
      },
    });
  };
};

export const UserLocation = (location, address) => {
  return async (dispatch) => {
    dispatch({
      type: USER_LOCATION,
      location: {
        location,
        address,
      },
    });
  };
};

export const FetchUserFollowing = () => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((item) => {
          const data = item.data();
          const id = item.id;
          return { id, ...data };
        });
        dispatch({
          type: USER_FOLLOWING,
          following,
        });
      });
  };
};

export const FetchPlants = () => {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("plants")
      .get()
      .then((snapshot) => {
        const plants = snapshot.docs.map((value) => {
          const data = value.data();
          const id = value.id;
          return { id, ...data };
        });
        dispatch({
          type: PLANT_DATA,
          plants,
        });
      });
  };
};

export const UserPlant = (plant) => {
  const crop = [
    {
      color: "#55CEFF",
      icon: "https://firebasestorage.googleapis.com/v0/b/finalproject-f2df9.appspot.com/o/plants%2Fwater%2Fwater.png?alt=media&token=04cf96da-8290-4679-b5dc-3994a7dbf967",
      id: "anotherPlant001",
      name: "น้ำ",
      nameEn: "water",
    },
    {
      color: "#B99C6B",
      icon: "https://firebasestorage.googleapis.com/v0/b/finalproject-f2df9.appspot.com/o/plants%2Fhome%2Fhome.png?alt=media&token=e96eaf24-bfb4-43da-ab32-199eadde348b",
      id: "anotherPlant002",
      name: "บ้าน",
      nameEn: "home",
    },
  ];
  plant.mode == "custom"
    ? plant.result.map((item) => {
        item.allplants.map((val) => {
          crop.push(val);
        });
      })
    : plant.result.plant.map((item) => {
        item.allplants.map((val) => {
          crop.push(val);
        });
      });

  return async (dispatch) => {
    dispatch({
      type: USER_PLANT,
      userPlant: {
        plant,
        crop,
      },
    });
  };
};
