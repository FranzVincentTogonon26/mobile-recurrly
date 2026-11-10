import { Link, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface AuthFooterLinkProps {
  copy: string;
  linkLabel: string;
  href: Href;
}

const AuthFooterLink = ({ copy, linkLabel, href }: AuthFooterLinkProps) => {
  return (
    <View className="auth-link-row">
      <Text className="auth-link-copy">{copy}</Text>

      <Link href={href} asChild>
        <Pressable accessibilityRole="link" hitSlop={8}>
          <Text className="auth-link">{linkLabel}</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default AuthFooterLink;
