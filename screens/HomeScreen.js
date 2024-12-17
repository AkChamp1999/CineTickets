import React, { useLayoutEffect, useEffect, useContext, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Place } from "../PlaceContext";
import { client } from "../cinetickets-sanity/sanity";
import MovieCard from "../components/MovieCard";
import Header from "../components/Header";
import { Foundation } from "@expo/vector-icons";
import { BottomModal } from "react-native-modals";
import { ModalFooter } from "react-native-modals";
import { ModalTitle } from "react-native-modals";
import { SlideAnimation } from "react-native-modals";
import { ModalContent } from "react-native-modals";

const HomeScreen = ({ userId }) => {
  const navigation = useNavigation();
  const { selectedCity, setSelectedCity } = useContext(Place);
  const moveAnimation = new Animated.Value(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState();
  const [moviesData, setMoviesData] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const result = await client.fetch(`*[_type == "movie"]`);
      setMoviesData(result);
      setSortedData(result);
    };

    const fetchUser = async () => {
      if (userId) {
        try {
          const user = await client.fetch(
            `*[_type == "user" && _id == $userId][0]`,
            { userId }
          );
          setLoggedInUser(user);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchMovies();
    fetchUser();
  }, [userId]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(moveAnimation, {
        toValue: -30,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [selectedCity]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Text style={styles.headerText}>
          Hello {loggedInUser ? loggedInUser.name : "Guest"}
        </Text>
      ),
      headerStyle: {
        backgroundColor: "#F5F5F5",
        shadowColor: "transparent",
        shadowOpacity: 0.3,
        shadowOffset: { width: -1, height: 1 },
        shadowRadius: 3,
      },
      headerRight: () => (
        <Pressable
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Ionicons
            onPress={() => navigation.navigate("Places")}
            name="ios-location-outline"
            size={24}
            color="black"
          />
          <Pressable onPress={() => navigation.navigate("Places")}>
            <Animated.Text
              style={[
                styles.text,
                { transform: [{ translateX: moveAnimation }] },
              ]}
            >
              <Text>{selectedCity}</Text>
            </Animated.Text>
          </Pressable>
        </Pressable>
      ),
    });
  }, [selectedCity, loggedInUser]);

  const languages = [
    { id: "0", language: "English" },
    { id: "10", language: "Kannada" },
    { id: "1", language: "Telugu" },
    { id: "2", language: "Hindi" },
    { id: "3", language: "Tamil" },
    { id: "5", language: "Malayalam" },
    { id: "6", language: "Marathi" },
  ];

  const genres = [
    { id: "0", language: "Horror" },
    { id: "1", language: "Comedy" },
    { id: "2", language: "Action" },
    { id: "3", language: "Romance" },
    { id: "5", language: "Thriller" },
    { id: "6", language: "Drama" },
  ];

  const applyFilter = () => {
    setModalVisible(false);
    if (selectedFilter) {
      const filteredData = moviesData.filter(
        (item) => item.original_language === selectedFilter
      );
      setSortedData(filteredData);
    } else {
      setSortedData(moviesData); // Reset to full list if no filter is selected
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListHeaderComponent={Header}
        data={sortedData}
        keyExtractor={(item) => item.id || item._id || item.title}
        renderItem={({ item }) => <MovieCard item={item} />}
      />
      <Pressable
        onPress={() => setModalVisible(!modalVisible)}
        style={styles.filterButton}
      >
        <Foundation name="filter" size={24} color="black" />
      </Pressable>
      <BottomModal
        onBackdropPress={() => setModalVisible(false)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        footer={
          <ModalFooter>
            <Pressable
              onPress={applyFilter}
              style={{
                paddingRight: 10,
                marginLeft: "auto",
                marginRight: "auto",
                marginVertical: 10,
                marginBottom: 30,
              }}
            >
              <Text>Apply</Text>
            </Pressable>
          </ModalFooter>
        }
        modalTitle={<ModalTitle title="Filters" />}
        modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        visible={modalVisible}
        onHardwareBackPress={() => setModalVisible(false)}
        onTouchOutside={() => setModalVisible(false)}
      >
        <ModalContent style={{ width: "100%", height: 280 }}>
          <Text
            style={{
              paddingVertical: 5,
              fontSize: 15,
              fontWeight: "500",
              marginTop: 10,
            }}
          >
            Languages
          </Text>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {languages.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => setSelectedFilter(item.language)}
                style={{
                  margin: 10,
                  backgroundColor:
                    selectedFilter === item.language ? "orange" : "transparent",
                  borderColor: "#C8C8C8",
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderRadius: 25,
                  paddingHorizontal: 11,
                }}
              >
                <Text
                  style={{
                    color: selectedFilter === item.language ? "white" : "black",
                  }}
                >
                  {item.language}
                </Text>
              </Pressable>
            ))}
          </Pressable>
        </ModalContent>
      </BottomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButton: {
    position: "absolute",
    bottom: 10,
    backgroundColor: "#ffc40c",
    width: 60,
    height: 60,
    borderRadius: 30,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 10,
  },
});

export default HomeScreen;
