import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";

const Header = () => {
  return (
    <View style={{ marginBottom: 55 }}>
      <ImageBackground
        style={{ height: 200, resizeMode: "contain" }}
        source={{
          uri: "https://prod-ripcut-delivery.disney-plus.net/v1/variant/disney/6EFE5D659E7C958E1177440F847E6CDAEBFD90F3162991ABE61FB584231DDAC1/scale?width=1200&aspectRatio=1.78&format=webp",
        }}
      >
        <Pressable
          style={{
            height: 90,
            backgroundColor: "white",
            padding: 10,
            borderRadius: 5,
            width: "90%",
            top: 160,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ fontSize: 15, fontWeight: "500" }}>
                Releasing in 10 Day
              </Text>
              <Text
                style={{ marginVertical: 5, fontSize: 16, fontWeight: "700" }}
              >
                MUFASA: THE LION KING
              </Text>
              <Text style={{ fontSize: 15, color: "gray", fontWeight: "500" }}>
                U.A • ENGLISH
              </Text>
            </View>
          </View>
        </Pressable>
      </ImageBackground>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
