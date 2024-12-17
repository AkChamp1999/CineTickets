import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useLayoutEffect, useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Place } from "../PlaceContext";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { client } from "../cinetickets-sanity/sanity";

const PlacesScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <Pressable
          style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          <Ionicons
            onPress={() => navigation.goBack()}
            name="arrow-back"
            size={24}
            color="black"
          />
          <Text style={{ fontSize: 15, letterSpacing: 1 }}>
            CHANGE LOCATION
          </Text>
        </Pressable>
      ),
    });
  }, []);
  const [cities, setCities] = useState([]);
  const { selectedCity, setSelectedCity, locationId, setLocationId } =
    useContext(Place);
  useEffect(() => {
    const fetchData = async () => {
      const result = await client.fetch(`
      *[_type == "location"]
      `);
      console.log("locations=" + JSON.stringify(result));
      setCities(result);
    };
    fetchData();
  }, []);
  const selectCity = (city, locationId) => {
    setSelectedCity(city);
    setLocationId(locationId);
    setTimeout(() => {
      navigation.navigate("HomeScreen");
    }, 800);
  };
  console.log(cities);
  return (
    <View>
      <View
        style={{
          margin: 10,
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderColor: "#E0E0E0",
          borderWidth: 2,
          borderRadius: 30,
        }}
      >
        <TextInput placeholder="Search Your City" />
        <Feather name="search" size={24} color="black" />
      </View>

      <View
        style={{
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text>Selected Location</Text>
        <Text>{selectedCity}</Text>
      </View>

      <FlatList
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        data={cities}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => selectCity(item.city, item._id)}
            style={{ marginVertical: 10, marginHorizontal: 20 }}
          >
            <ImageBackground
              imageStyle={{ borderRadius: 8 }}
              style={{ width: 160, height: 100, opacity: 0.8 }}
              source={{ uri: item.image }}
            >
              {selectedCity === item.city && (
                <View
                  style={{
                    flex: 1,
                    marginLeft: 7,
                    marginTop: 7,
                    alignContent: "flex-start",
                  }}
                >
                  <AntDesign name="checkcircle" size={24} color="white" />
                </View>
              )}
              <View
                style={{
                  flex: 1,
                  marginLeft: 10,
                  marginBottom: 7,
                  justifyContent: "flex-end",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "700" }}
                >
                  {item.city}
                </Text>
              </View>
            </ImageBackground>
          </Pressable>
        )}
      />
    </View>
  );
};

export default PlacesScreen;

const styles = StyleSheet.create({});
