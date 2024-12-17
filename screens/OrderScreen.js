import React, { useContext, useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { client } from "../cinetickets-sanity/sanity";
import SvgQRCode from "react-native-qrcode-svg";
import { UserContext } from "../UserContext";
import { useFocusEffect } from "@react-navigation/native";

const OrderScreen = () => {
  const [tickets, setTickets] = useState([]);
  const { user } = useContext(UserContext);

  const fetchTickets = () => {
    if (user && user.email) {
      const userEmail = user.email;
      const query = `*[_type == "ticket" && userEmail == "${userEmail}"] | order(createdAt desc)`;

      client
        .fetch(query)
        .then((result) => {
          console.log("Fetched tickets:", JSON.stringify(result));
          setTickets(result);
        })
        .catch((error) => {
          console.log("Error fetching tickets:", error);
        });
    }
  };

  // Fetch tickets when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchTickets();
    }, [user])
  );

  const renderTicketItem = ({ item }) => {
    const seatNumbers = item.selectedSeats
      .map((seat) => seat.row + seat.seat)
      .join(", ");

    const qrData = JSON.stringify({
      ticketID: item._id,
      movieName: item.movieName,
      mall: item.mall,
      seats: seatNumbers,
      totalAmount: item.totalAmount,
      date: item.date,
      showtime: item.showtime,
    });

    return (
      <View style={styles.ticketContainer}>
        <Text style={styles.ticketTitle}>Ticket ID: {item._id}</Text>
        <Text style={styles.ticketDetails}>{item.movieName}</Text>
        <Text style={styles.ticketDetails}>{item.mall}</Text>
        <Text style={styles.ticketDetails}>Seats: {seatNumbers}</Text>
        <Text style={styles.ticketDetails}>Total: ₹{item.totalAmount}</Text>
        <Text style={styles.ticketDetails}>Date: {item.date}</Text>
        <Text style={styles.ticketDetails}>Showtime: {item.showtime}</Text>

        {/* QR Code Display */}
        <View style={styles.qrCodeContainer}>
          <SvgQRCode value={qrData} />
        </View>

        {/* Seat Grid */}
        <View style={styles.seatGridContainer}>
          <Text style={styles.seatGridTitle}>Seat Layout</Text>
          <View style={styles.seatGrid}>
            {item.selectedSeats.map((seat, index) => (
              <View key={index} style={styles.seatBlock}>
                <Text style={styles.seatBlockText}>{seat.row + seat.seat}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={tickets}
      renderItem={renderTicketItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.flatListContainer}
      ListHeaderComponent={() => (
        <Text style={styles.headerText}>Your Orders</Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    padding: 20,
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ticketContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 15,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ticketDetails: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  qrCodeContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  seatGridContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  seatGridTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  seatGrid: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  seatBlock: {
    backgroundColor: "#FFD700",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  seatBlockText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default OrderScreen;
