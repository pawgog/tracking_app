import { StyleSheet, View, Text } from "react-native";
import { Icon } from "@ui-kitten/components";

export const ButtonPermission = ({ isGranted }: { isGranted: boolean }) => {
  return (
    <View style={styles.container}>
      <Text>Permission: </Text>
      {isGranted ? (
        <Icon
          style={styles.icon}
          fill="green"
          name="checkmark-circle-2-outline"
        />
      ) : (
        <Icon style={styles.icon} fill="red" name="alert-circle-outline" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  icon: {
    width: 24,
    height: 24,
  },
});
