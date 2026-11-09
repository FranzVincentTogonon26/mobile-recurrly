import { Link } from "expo-router";
import { Text, View } from "react-native";

const SignUp = () => {
  return (
    <View>
      <Text>sign-in</Text>
      <Link href={"/(auth)/sign-up"}>Create In</Link>
    </View>
  );
};

export default SignUp;
