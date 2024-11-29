import {
  StyleSheet,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Icon, Spinner } from "@ui-kitten/components";

export type Props = {
  loading: boolean;
  handleCurrentPosition: (event: GestureResponderEvent) => void;
};

export const ButtonLocation: React.FC<Props> = ({
  loading,
  handleCurrentPosition,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        disabled={loading}
        onPress={(e) => handleCurrentPosition(e)}
      >
        {loading ? (
          <Spinner status="warning" />
        ) : (
          <Icon style={styles.icon} fill="white" name="navigation-2" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    bottom: 70,
  },
  button: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
    borderRadius: 100,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
