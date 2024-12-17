import React, { useContext, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import {
  Entypo,
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import PlacesScreen from "../screens/PlacesScreen";
import MovieScreen from "../screens/MovieScreen";
import TheatreScreen from "../screens/TheatreScreen";
import FoodScreen from "../screens/FoodScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import TicketScreen from "../screens/TicketScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import OrderScreen from "../screens/OrderScreen";
import { UserContext } from "../UserContext";

const ProfileStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const OrderStack = createNativeStackNavigator();

function HomeStackScreens({ userId }) {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeScreen" options={{ title: "" }}>
        {() => <HomeScreen userId={userId} />}
      </HomeStack.Screen>
      <HomeStack.Screen name="Places" component={PlacesScreen} />
      <HomeStack.Screen name="Movie" component={MovieScreen} />
      <HomeStack.Screen name="Theatre" component={TheatreScreen} />
      <HomeStack.Screen name="Food" component={FoodScreen} />
      <HomeStack.Screen name="Confirmation" component={ConfirmationScreen} />
      <HomeStack.Screen name="Ticket" component={TicketScreen} />
    </HomeStack.Navigator>
  );
}

function ProfileStackScreens({ userId }) {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile">
        {() => <ProfileScreen userId={userId} />}
      </ProfileStack.Screen>
    </ProfileStack.Navigator>
  );
}

function OrderStackScreens() {
  return (
    <OrderStack.Navigator>
      <OrderStack.Screen name="Order" component={OrderScreen} />
    </OrderStack.Navigator>
  );
}

function AuthStackScreens({ setIsLoggedIn, setUserId }) {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            setIsLoggedIn={setIsLoggedIn}
            setUserId={setUserId} // Pass setUserId to LoginScreen
          />
        )}
      </AuthStack.Screen>
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [userId, setUserId] = useState(null); // State to store logged-in user's ID

  const { user } = useContext(UserContext);

  return (
    <NavigationContainer>
      {user && isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            options={{
              tabBarLabel: "Home",
              tabBarLabelStyle: { color: "black" },
              headerShown: false,
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <Entypo name="home" size={24} color="black" />
                ) : (
                  <AntDesign name="home" size={24} color="black" />
                ),
            }}
          >
            {() => <HomeStackScreens userId={userId} />}
          </Tab.Screen>
          <Tab.Screen
            name="OrderScreen"
            options={{
              tabBarLabel: "Orders",
              tabBarLabelStyle: { color: "black" },
              headerShown: false,
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <MaterialCommunityIcons
                    name="ticket-confirmation"
                    size={24}
                    color="black"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="ticket-confirmation-outline"
                    size={24}
                    color="black"
                  />
                ),
            }}
          >
            {() => <OrderStackScreens />}
          </Tab.Screen>
          <Tab.Screen
            name="ProfileScreen"
            options={{
              tabBarLabel: "Profile",
              tabBarLabelStyle: { color: "black" },
              headerShown: false,
              tabBarIcon: ({ focused }) =>
                focused ? (
                  <Ionicons name="person" size={24} color="black" />
                ) : (
                  <Ionicons name="person-outline" size={24} color="black" />
                ),
            }}
          >
            {() => <ProfileStackScreens userId={userId} />}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <AuthStackScreens
          setIsLoggedIn={setIsLoggedIn}
          setUserId={setUserId} // Pass setUserId
        />
      )}
    </NavigationContainer>
  );
}

export default Navigation;
