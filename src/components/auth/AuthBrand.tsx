import { icons } from "@/constants/icons";
import { Image, Text, View } from "react-native";

const AuthBrand = () => {
  return (
    <View className="auth-brand-block">
      <View className="auth-logo-wrap">
        <Image
          source={icons.logo}
          className="auth-logo-image"
          accessible={false}
        />

        <View>
          <Text className="auth-wordmark">Recurrly</Text>
          <Text className="auth-wordmark-sub">Smart billing</Text>
        </View>
      </View>
    </View>
  );
};

export default AuthBrand;
