import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { client } from "../cinetickets-sanity/sanity";
import { UserContext } from "../UserContext";

const ProfileScreen = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user, logout, updateUser } = useContext(UserContext);

  // State to trigger re-fetch after profile update
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Fetch user data from Sanity
    const fetchUserData = async () => {
      console.log("Fetching user data");
      try {
        const query = `*[_type == "user" && _id == $userId][0]`; // Sanity GROQ query
        const data = await client.fetch(query, { userId });
        if (data) {
          setUserData(data);
          setName(data.name || "");
          setMobile(data.mobile || "");
          setEmail(data.email || "");
          setPassword(data.password || ""); // Assuming the password is stored securely in Sanity
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, refresh]); // Trigger re-fetch when `refresh` changes

  const handleUpdateProfile = async () => {
    try {
      if (newPassword && newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      // Prepare data for update
      const updateData = { name, mobile, email };
      if (newPassword) updateData.password = newPassword;

      // Update user profile in Sanity
      await client.patch(userId).set(updateData).commit();

      alert("Profile updated successfully!");

      // Fetch updated data directly after successful update
      const updatedData = await client.fetch(
        `*[_type == "user" && _id == $userId][0]`,
        { userId }
      );
      setUserData(updatedData);
      setName(updatedData.name || "");
      setMobile(updatedData.mobile || "");
      setEmail(updatedData.email || "");
      setPassword(updatedData.password || ""); // Assuming password is securely stored

      // Update the user context with the new data
      updateUser(updatedData); // This will update the context and AsyncStorage

      // Trigger re-fetch
      setRefresh((prev) => !prev);

      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout", // Title
      "Are you sure you want to log out?", // Message
      [
        {
          text: "Cancel",
          style: "cancel", // 'Cancel' button styling
        },
        {
          text: "Logout",
          style: "destructive", // 'Logout' button styling
          onPress: async () => {
            await logout(); // Clear user session
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#f00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Profile</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mobile</Text>
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your current password"
          secureTextEntry
          editable={false} // Make it readonly
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdateProfile}
      >
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.updateButton} onPress={handleLogout}>
        <Text style={styles.updateButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: "#ffc40c",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
