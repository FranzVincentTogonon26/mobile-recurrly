import { Text, View } from "react-native";

interface MetricCardProps {
  label: string;
  value: string;
  subLabel?: string;
}

const MetricCard = ({ label, value, subLabel }: MetricCardProps) => {
  return (
    <View className="flex-1 rounded-2xl border border-black/10 bg-card p-4 shadow-xs">
      <Text className="text-sm font-sans-medium text-muted-foreground">
        {label}
      </Text>
      <Text className="my-1 text-2xl font-sans-extrabold text-primary">
        {value}
      </Text>
      {subLabel ? (
        <Text className="text-xs font-sans-semibold text-primary/60">
          {subLabel}
        </Text>
      ) : null}
    </View>
  );
};

export default MetricCard;
