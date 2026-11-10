import { Pressable, Text, View } from "react-native";

interface InsightsEmptyStateProps {
  onAddPress: () => void;
}

const InsightsEmptyState = ({ onAddPress }: InsightsEmptyStateProps) => {
  return (
    <View className="items-center justify-center rounded-3xl border border-black/10 bg-card p-8">
      <Text className="text-4xl">📊</Text>
      <Text className="mt-3 text-lg font-sans-bold text-primary">
        No subscriptions yet
      </Text>
      <Text className="mt-1 text-center text-sm font-sans-medium text-muted-foreground">
        Add your first subscription to view your weekly spending insights and history.
      </Text>
      <Pressable
        onPress={onAddPress}
        className="mt-5 rounded-2xl bg-accent px-5 py-3 active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel="Add subscription"
      >
        <Text className="text-sm font-sans-bold text-background">
          Add Subscription
        </Text>
      </Pressable>
    </View>
  );
};

export default InsightsEmptyState;
