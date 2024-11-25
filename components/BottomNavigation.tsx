import { StyleSheet, Dimensions } from "react-native";
import { Button, Icon, Layout, Spinner } from "@ui-kitten/components";
import { LocationObjectCoords } from "expo-location";

type Props = {
  loading: boolean;
  locationWatcher: LocationObjectCoords[][];
  startWatcher: Function;
  clearWatcher: Function;
  handleDisplayPath: Function;
};

export const BottomNavigation: React.FC<Props> = ({
  loading,
  locationWatcher,
  startWatcher,
  clearWatcher,
  handleDisplayPath,
}) => {
  return (
    <Layout style={styles.container}>
      {loading ? (
        <Button style={styles.button} appearance="outline" status="info">
          <Spinner size="small" />
        </Button>
      ) : (
        <Button
          style={styles.button}
          appearance="outline"
          status="info"
          accessoryLeft={<Icon name="play-circle" />}
          onPress={() => startWatcher()}
        >
          START
        </Button>
      )}

      <Button
        style={styles.button}
        appearance="outline"
        status="info"
        accessoryLeft={<Icon name="pause-circle" />}
        onPress={() => clearWatcher()}
      >
        STOP
      </Button>
      <Button
        style={styles.button}
        appearance="outline"
        status="info"
        disabled={locationWatcher.length <= 1}
        accessoryLeft={<Icon name="activity" />}
        onPress={() => handleDisplayPath()}
      >
        PATH
      </Button>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    alignItems: "stretch",
  },
  button: {
    justifyContent: "center",
    alignItems: "stretch",
    width: "34%",
  },
});
