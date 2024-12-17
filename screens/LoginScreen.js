import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  Alert,
} from "react-native";
import { client } from "../cinetickets-sanity/sanity";
import { UserContext } from "../UserContext";
import { Image } from "react-native";

const LoginScreen = ({ navigation, setIsLoggedIn, setUserId }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(UserContext);

  const handleLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert("Login Failed", "Both fields are required.");
      return;
    }

    // Validate mobile number format
    if (!/^\d{10}$/.test(mobileNumber)) {
      Alert.alert(
        "Invalid Mobile Number",
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    try {
      // Query the Sanity database to validate user credentials
      const query = `*[_type == "user" && mobile == $mobileNumber && password == $password][0]`;
      const params = { mobileNumber, password };

      const user = await client.fetch(query, params);

      if (user) {
        Alert.alert("Login Successful", `Welcome, ${user.name}!`, [
          {
            text: "OK",
            onPress: () => {
              setIsLoggedIn(true);
              setUserId(user._id);
              login(user);
            },
          },
        ]);
      } else {
        Alert.alert("Login Failed", "Invalid mobile number or password.", [
          { text: "Try Again" },
        ]);
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert(
        "Login Failed",
        "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo3.jpeg")} style={styles.logo} />
      </View>
      <Text style={styles.header}>Login</Text>
      <TextInput
        placeholder="Mobile Number"
        style={styles.input}
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </Pressable>
      <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: "blue",
    textAlign: "center",
  },
  logoContainer: {
    marginBottom: 20,
    marginTop: -200,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 80,
  },
  loginButton: {
    backgroundColor: "#ffc40c",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
