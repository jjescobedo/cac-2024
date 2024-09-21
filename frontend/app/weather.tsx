import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

const Weather: React.FC = () => {
  const router = useRouter();

  // Placeholder data
  const [loading, setLoading] = useState(true);
  const [uvRating, setUvRating] = useState(null);
  const [uvRisk, setUvRisk] = useState(null);
  const [temperature, setTemperature] = useState('87° F');
  const [weatherCondition, setWeatherCondition] = useState('Sunny');
  const [weatherIcon, setWeatherIcon] = useState('🌞');

  // Dictionary for weather icons
  const weatherIcons = {
    Sunny: '🌞',
    Cloudy: '☁️',
    'Partly Cloudy': '⛅',
    Windy: '🌬️',
    Raining: '🌧️',
    Snowing: '❄️',
    Lightning: '⚡'
  };

  useEffect(() => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
  
      try {
        const response = await fetch(`https://cac-2024-api.onrender.com/weather/weather?lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        setUvRating(data.uv_index);
        setUvRisk(data.skin_cancer_risk);
        const roundedTemperature = Math.round(data.temperature);
        setTemperature(`${roundedTemperature}° F`);
        setWeatherCondition(data.forecast);
        setWeatherIcon(weatherIcons[data.forecast] || '🌞');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Determine UV rating color
  let uvRatingColor;
  if (uvRating <= 2) {
    uvRatingColor = 'green';
  } else if (uvRating <= 7) {
    uvRatingColor = 'orange';
  } else {
    uvRatingColor = 'red';
  }

  // Determine protection content based on UV rating
  let protectionContent;
  if (uvRating <= 2) {
    protectionContent = (
      <View>
        <Text style={[styles.protTitle, { color: uvRatingColor }]}>Low Skin Cancer Risk</Text>
        <Text style={styles.protTextBody}>
          UV radiation from the sun can damage skin cell DNA, leading to mutations that increase the risk of skin cancer. Protecting your skin with sunscreen, clothing, and shade helps reduce this risk.
          </Text>
        <FlatList data= {[
            { key: 'No protection needed. You can safely stay outside!' },
          ]}
          renderItem={({ item }) => <Text style={styles.protTextList}>{item.key}</Text>} />
      </View>
    );
  } else if (uvRating <= 7) {
    protectionContent = (
      <View>
        <Text style={[styles.protTitle, { color: uvRatingColor }]}>Moderate Skin Cancer Risk</Text>
        <Text style={styles.protTextBody}>
          UV radiation from the sun can damage skin cell DNA, leading to mutations that increase the risk of skin cancer. Protecting your skin with sunscreen, clothing, and shade helps reduce this risk.
          </Text>
        <FlatList data= {[
            { key: 'Wear sunglasses and use SPF 30+ sunscreen.' },
            { key: 'Seek shade during midday hours.' },
          ]}
          renderItem={({ item }) => <Text style={styles.protTextList}>{item.key}</Text>} />
      </View>
    );
  } else {
    protectionContent = (
      <View>
        <Text style={[styles.protTitle, { color: uvRatingColor }]}>Severe Skin Cancer Risk</Text>
        <Text style={styles.protTextBody}>
          UV radiation from the sun can damage skin cell DNA, leading to mutations that increase the risk of skin cancer. Protecting your skin with sunscreen, clothing, and shade helps reduce this risk.
          </Text>
        <FlatList data= {[
            { key: 'Wear sunglasses and use SPF 30+ sunscreen.' },
            { key: 'Avoid being outside during midday hours.' },
            { key: 'Seek shade during midday hours.' },
          ]}
          renderItem={({ item }) => <Text style={styles.protTextList}>{item.key}</Text>} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
      <View style={styles.uvweathContainer}>
        <View style={styles.leftContainer}>
          <Text style={styles.weatherTitle}>Weather</Text>
          <View style={styles.currentWeather}>
            <Text style={styles.weatherIcon}>{weatherIcon}</Text>
            <Text style={styles.condition}>{weatherCondition}</Text>
            <Text style={styles.temperature}>{temperature}</Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.uvTitle}>UV Rating</Text>
          <Text style={[styles.uvRating, { color: uvRatingColor }]}>{uvRating}</Text>
          <Text style={styles.uvRisk}>{uvRisk}</Text>
        </View>
      </View>
      <View style={styles.protContainer}>
        {protectionContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  backButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 10,
    marginLeft: 20,
    marginTop: -24,
    marginBottom: -4,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uvweathContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 30,
  },
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 30,
  },

  // Weather styles
  weatherTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  currentWeather: {
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherIcon: {
    fontSize: 80,
    marginTop: -10,
  },
  condition: {
    fontSize: 18,
    color: 'gray',
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  // UV styles
  uvTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 1,
  },
  uvRating: {
    fontSize: 60,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 10,
  },
  uvRisk: {
    fontSize: 18,
    color: 'gray',
    marginTop: -6,
  },

  // Protection styles
  
  // Protection styles
  protContainer: {
    backgroundColor: 'white',
    width: 350,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    padding: 20,
  },
  protTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  protText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  protButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  protButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Weather;