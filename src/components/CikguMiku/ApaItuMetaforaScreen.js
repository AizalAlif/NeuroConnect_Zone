import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

export default function ApaItuMetaforaScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../assets/background14.jpg')} style={styles.background}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Apa Itu Metafora?</Text>
          <Text style={styles.body}>
            Metafora adalah ungkapan yang menggunakan perbandingan secara langsung tanpa menggunakan kata seperti 
            'bagai' atau 'seperti'. Contohnya, "Dia adalah bintang di langit malam," bermaksud seseorang yang 
            sangat menonjol.
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker, slightly transparent background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30, // Fully rounded corners
    flexDirection: 'row', // Align text and icon horizontally
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // Elevation for Android
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600', // Slightly bolder text
    letterSpacing: 1, // Adds spacing for a cleaner look
    marginLeft: 10, // Space between the icon and the text
  },
  contentContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
