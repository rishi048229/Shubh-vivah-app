import ServiceCard from "@/components/Home/ServiceCard";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ServiceScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={Colors.ivory} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Our Services</Text>
        <Text style={styles.headerSubtitle}>From planning to perfection</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ServiceCard
          title="Event Management"
          description="Complete wedding planning and execution."
          imageUri="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          number="1"
          variant="cream"
          onPress={() => console.log("Book Event Management")}
        />
        <ServiceCard
          title="Wedding Invite"
          description="Customized digital and physical invitations."
          imageUri="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          number="2"
          variant="red"
          onPress={() => console.log("Book Invites")}
        />
        <ServiceCard
          title="Wedding Venues"
          description="Exclusive venues for your special day."
          imageUri="https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          number="3"
          variant="cream"
          onPress={() => console.log("Book Venue")}
        />
        <ServiceCard
          title="Catering"
          description="Delicious menus tailored to your taste."
          imageUri="https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          number="4"
          variant="red"
          onPress={() => console.log("Book Catering")}
        />
        <ServiceCard
          title="Photography"
          description="Capturing moments that last a lifetime."
          imageUri="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
          number="5"
          variant="cream"
          onPress={() => console.log("Book Photography")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.ivory,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.ivory,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D1406",
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.maroon,
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
});
