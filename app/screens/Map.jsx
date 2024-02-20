import { FIREBASE_DB } from '../../FireBaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import React, { useState, useRef, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions
} from "react-native";

const { width, height } = Dimensions.get("window");


export default function Map() {

  const [data, setData] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null);
  const [dark, setDark] = useState(false);
  

  const fetchDataFromFirestore = async () => {
    try {
      const collectionRef = collection(FIREBASE_DB, 'books');
      const snapshot = await getDocs(collectionRef);
      console.log(snapshot)
      const fetchedData = [];
      snapshot.forEach((doc) => {
        fetchedData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log('Pokemon Master')
      console.log(fetchedData);
      console.log('Pokemon Trainer')
      console.log(fetchedData[0].coords.latitude);
      console.log('Pokemon Breeder')
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []); // useEffect to fetch data when the component mounts


  const handleZoomIn = () => {
    mapRef.current?.getCamera().then((cam) => {
      const zoomLevel = getZoomForPlatform(cam.zoom, true);
      cam.zoom = zoomLevel;
      mapRef.current?.animateCamera(cam);
    });
  };

  const handleZoomOut = () => {
    mapRef.current?.getCamera().then((cam) => {
      const zoomLevel = getZoomForPlatform(cam.zoom);
      cam.zoom = zoomLevel;
      mapRef.current?.animateCamera(cam);
    });
  };


  const getZoomForPlatform = (currentZoom, zoomOut = false) => {
    let zoomLevel = currentZoom;
    if (Platform.OS === "android") {
      zoomLevel = zoomOut ? zoomLevel - 1 : zoomLevel + 1;
    } else if (Platform.OS === "ios") {
      zoomLevel = zoomOut ? currentZoom * 1.1 : currentZoom / 1.1;
    } else {
      zoomLevel = zoomOut ? zoomLevel - 1 : zoomLevel + 1;
    }
    return zoomLevel;
  };

  return (
    <View>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        customMapStyle={dark ? nightMap : mapStyle}
        initialRegion={{
          latitude: 53.47214483258923,
          longitude: -2.2384571315116277,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
      >
        {data.map((loc) => {
          return (
            <Marker
              coordinate={{
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              }}
              title={loc.bookTitle}
              description={loc.bookDesc}
              key={loc.id}
              onPress={() => setSelectedMarker(loc.id)}
            >
              <View style={styles.nameAndImageContainer}>
                <Text style={styles.markerBookTitle}>{loc.bookTitle}</Text>
                <View style={styles.ImageContainer}>
                  <Image
                    source={require("../../Images/Colorful-books-on-transparent-background-PNG Background Removed.png")}
                    style={styles.markerImage}
                  ></Image>
                </View>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <TouchableOpacity onPress={handleZoomIn} style={styles.zoomInButton}>
        <Text style={styles.buttonTextIn}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleZoomOut} style={styles.zoomOutButton}>
        <Text style={styles.buttonTextOut}>-</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setDark(!dark)}
        style={{
          backgroundColor: "#FFF",
          borderColor: "black",
          borderWidth: 2,
          height: 55,
          borderRadius: 40,
          width: 55,
          alignContent: "center",
          justifyContent: "center",
          position: "absolute",
          marginTop: 30,
          alignSelf: "flex-end",
          right: 12,
        }}
        >
        <Image
        source={require("../../Images/sun-and-moon-icon-isolated-on-transparent-vector-24794605 Background Removed.png")}
        style={styles.lightAndDarkIcon}
      />
      </TouchableOpacity>
    </View>
  );
}
// day-night-switch-between-light-and-dark-mode-sun-and-half-moon-icon-in-line-style-design-isolated-on-white-background-editable-stroke-vector.jpg
// moon-and-stars-icon-on-transparent-background-vector-24062838 Background Removed.png
// sun-and-moon-icon-isolated-on-transparent-vector-24794605 Background Removed.png

const styles = StyleSheet.create({
  map: {
    width: width,    // Takes up the full width of the map
    height: 675,
    // borderWidth: 4,
    // borderColor: "black",
    // marginBottom: 20,
    // width: width, // for full screen 
    // height: height, // for full screen
    // ...StyleSheet.absoluteFillObject, 
  },
  nameAndImageContainer: {
    padding: 10,
    display: "flex",
  },
  markerBookTitle: {
    color: "purple",
    fontWeight: "bold",
    fontFamily: "Arial",
    fontSize: 12,
    padding: 1,
    marginBottom: 4,
  },
  ImageContainer: {
    display: "grid",
    justifyContent: "center",
    alignItems: "center",
  },
  markerImage: {
    width: 30,
    height: 30,
  },
  lightAndDarkIcon: { 
    width: 85,
    height: 85,
    color: 'red',
    right: 15,
    top: 4,
  },

  zoomInButton: {
    position: "absolute",
    bottom: 148,
    right: 11,
    backgroundColor: "grey",
    borderRadius: 100,
    padding: 5,
    width: 55,
    height: 55,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomOutButton: {
    position: "absolute",
    bottom: 80,
    right: 11,
    backgroundColor: "grey",
    borderRadius: 100,
    paddingBottom: 35,
    height: 55,
    width: 55,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextIn: {
    color: "white",
    fontSize: 30,
    textAlign: "center",
  },
  buttonTextOut: {
    color: "white",
    fontSize: 60,
    paddingBottom: 40,
  },
});




const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#523735",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#c9b2a6",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#dcd2be",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ae9e90",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#93817c",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#a5b076",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#447530",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#fdfcf8",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#f8c967",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#e9bc62",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#e98d58",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#db8555",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#806b63",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8f7d77",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#b9d3c2",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#92998d",
      },
    ],
  },
];

const nightMap = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
];














// const arr = [
//   {"bookAuthor": "Jk rowlinh", "bookDesc": "It’s good ", "bookTitle": "Harry Potter ", "coords": 
//     {"latitude": 53.4651241, "longitude": -2.253572}, "id": "0B0KTsMx3IkjoDD8XXz7", "seller": "Aisha"}, 
//   {"bookAuthor": "A", "bookDesc": "A", "bookTitle": "A", "coords": 
//    {"latitude": 53.445558, "longitude": -1.9383954}, "id": "H64Z1GqWMAzy0Uy74fdf", "user": "h@x.com"}, 
//   {"bookAuthor": "hi", "bookTitle": "hi", "id": "J7JzQcuKMVoDWDeEuXTw", "location": 
//     {"latitude": 55.378051, "longitude": -3.435973}, "seller": "hi"}, 
//   {"bookAuthor": "WOW AUTHOR", "bookDesc": "I HUGE DESCRIPTION GOES HERE", "bookTitle": "Testing!!!!", "coords": 
//     {"latitude": 53.4825336, "longitude": -2.2361946}, "id": "Nhq1UgxAAZCY462Il9WK", "user": "h@x.com"}, 
//   {"bookAuthor": "Hi", "bookDesc": "Hi", "bookTitle": "Hi", "coords": 
//     {"latitude": 53.3308927, "longitude": -2.2292156}, "id": "R4R57ULP5AyFZJ4inYAU", "seller": "Hi"}, 
//   {"bookAuthor": "Title", "bookTitle": "Title", "id": "ZSQkVPVOnuLqkUFWSQWf", "postcode": 
//     {"latitude": 53.3156958, "longitude": -2.2380617}, "seller": "Title"}
// ]