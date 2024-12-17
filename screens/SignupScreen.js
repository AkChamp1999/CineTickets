import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Alert,
  Pressable,
} from "react-native";
import { client } from "../cinetickets-sanity/sanity";
import { Image } from "react-native";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !mobileNumber || !password) {
      Alert.alert("Signup Failed", "All fields are required.");
      return;
    }

    // Validate mobile number
    if (!/^\d{10}$/.test(mobileNumber)) {
      Alert.alert(
        "Invalid Mobile Number",
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // Validate password length
    if (password.length < 8) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long."
      );
      return;
    }

    try {
      // Check if a user with the same email or mobile number already exists
      const query = `*[_type == "user" && (email == $email || mobile == $mobileNumber)]`;
      const params = { email, mobileNumber };
      const existingUsers = await client.fetch(query, params);

      // Check for individual conflicts
      const emailExists = existingUsers.some((user) => user.email === email);
      const mobileExists = existingUsers.some(
        (user) => user.mobile === mobileNumber
      );

      if (emailExists && mobileExists) {
        Alert.alert(
          "Signup Failed",
          "A user with this email and mobile number already exists."
        );
        return;
      } else if (emailExists) {
        Alert.alert("Signup Failed", "A user with this email already exists.");
        return;
      } else if (mobileExists) {
        Alert.alert(
          "Signup Failed",
          "A user with this mobile number already exists."
        );
        return;
      }
      // Add user to Sanity database
      const newUser = {
        _type: "user",
        name,
        email,
        mobile: mobileNumber,
        password, // Include password in the user data
      };

      await client.create(newUser);
      Alert.alert("Signup Successful", "Your account has been created!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"), // Navigate to Login screen
        },
      ]);
    } catch (error) {
      console.error("Error creating user:", error);
      Alert.alert(
        "Signup Failed",
        "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../assets/logo3.jpeg")} style={styles.logo} />
      </View>
      <Text style={styles.header}>Sign Up</Text>
      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
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
      <Pressable onPress={handleSignup} style={styles.signUpButton}>
        <Text style={styles.signUpButtonText}>SIGN UP</Text>
      </Pressable>
      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account? Log in
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
  signUpButton: {
    backgroundColor: "#ffc40c",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logoContainer: {
    marginBottom: 20,
    marginTop: -100,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 80,
  },
});

export default SignupScreen;
