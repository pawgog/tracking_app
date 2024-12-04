import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  PermissionsAndroid,
} from "react-native";

import * as Location from "expo-location";
import * as Crypto from "expo-crypto";

import Mapbox, {
  MapView,
  Camera,
  ShapeSource,
  LineLayer,
  SymbolLayer,
  Images,
} from "@rnmapbox/maps";
import { BottomNavigation } from "@/components/BottomNavigation";
import { ButtonLocation } from "@/components/ButtonLocation";
import { ButtonPermission } from "@/components/ButtonPermission";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN as string);

const requestPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "This app needs access to your location",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export default function HomeScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingWatcher, setLoadingWatcher] = useState<boolean>(false);
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [locationWatcher, setLocationWatcher] = useState<
    Location.LocationObjectCoords[][]
  >([]);
  const [watcher, setWatcher] = useState<Location.LocationSubscription | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [errorWatcher, setErrorWatcher] = useState<string | null>(null);
  const [isGranted, setPermission] = useState<boolean>(false);
  const map = useRef<MapView | null>(null);
  const camera = useRef<Camera | null>(null);
  const shape = useRef<ShapeSource>(null);

  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        const permissionGranted = await requestPermission();
        setPermission(permissionGranted);
      } else {
        setPermission(true);
      }
    };
    getPermission();
  }, []);

  const handleCurrentPosition = async () => {
    setLoading(true);
    await Location.getCurrentPositionAsync({
      accuracy: 4,
      distanceInterval: 100,
      timeInterval: 10000,
    })
      .then(({ coords }) => {
        setLocation(coords);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        setError(err);
        setLoading(false);
      });
    setError(null);
  };

  const startWatcher = async () => {
    setLoadingWatcher(true);
    await Location.watchPositionAsync(
      {
        accuracy: 4,
        distanceInterval: 100,
        timeInterval: 1000,
      },
      ({ coords }) => {
        setLocationWatcher((prev) => [...prev, [coords]]);
      }
    )
      .then((locationWatcher) => {
        setWatcher(locationWatcher);
      })
      .catch((err) => {
        console.warn(err);
        setErrorWatcher(err);
        setLoadingWatcher(false);
      });
    setErrorWatcher(null);
  };

  const clearWatcher = () => {
    watcher?.remove();
    setLoadingWatcher(false);
  };

  const handleDisplayPath = () => {
    const coord = locationWatcher.map((local) => [
      local[0].longitude,
      local[0].latitude,
    ]);
    const lineString = {
      type: "FeatureCollection" as const,
      properties: {},
      features: [
        {
          type: "Feature" as const,
          properties: {},
          geometry: {
            type: "LineString" as const,
            coordinates: coord,
          },
        },
      ],
    };

    camera.current?.setCamera({
      centerCoordinate: coord[0],
      zoomLevel: 11,
    });

    shape.current?.setNativeProps({
      id: Crypto.randomUUID(),
      shape: JSON.stringify(lineString),
    });
  };

  useEffect(() => {
    if (location) {
      const point = {
        type: "FeatureCollection" as const,
        properties: {},
        features: [
          {
            type: "Feature" as const,
            properties: {},
            geometry: {
              type: "Point" as const,
              coordinates: [location.longitude, location.latitude],
            },
          },
        ],
      };
      camera.current?.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 10,
      });
      shape.current?.setNativeProps({
        id: Crypto.randomUUID(),
        shape: JSON.stringify(point),
      });
    }
  }, [location]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tracking App</Text>
      <View>
        <ButtonPermission isGranted={isGranted} />
      </View>
      <View style={styles.page}>
        <View style={styles.mapContainer}>
          <MapView style={styles.map} ref={map} zoomEnabled={true}>
            <Camera ref={camera} />
            <ShapeSource id="line-source" ref={shape} lineMetrics={true}>
              <LineLayer
                id="line-layer"
                style={{ lineColor: "#BF93E4", lineWidth: 5 }}
              />
              <SymbolLayer
                id="symbol-location"
                minZoomLevel={1}
                style={{
                  iconImage: "pin",
                }}
              />
              <Images
                images={{ pin: require("../../assets/images/pin.png") }}
              />
            </ShapeSource>
          </MapView>
        </View>
      </View>
      {error ? <Text style={styles.location}>Error: {error}</Text> : null}
      {errorWatcher ? (
        <Text style={styles.location}>Error: {errorWatcher}</Text>
      ) : null}
      <ButtonLocation
        loading={loading}
        handleCurrentPosition={handleCurrentPosition}
      />
      <BottomNavigation
        loading={loadingWatcher}
        locationWatcher={locationWatcher}
        startWatcher={startWatcher}
        clearWatcher={clearWatcher}
        handleDisplayPath={handleDisplayPath}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: "100%",
  },
  map: {
    flex: 1,
  },
  location: {
    color: "#333333",
    marginBottom: 5,
  },
});
