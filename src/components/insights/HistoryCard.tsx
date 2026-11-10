import type { ExpenseHistoryItem } from "@/lib/insights";
import { formatCurrency } from "@/lib/utils";
import { Image, Pressable, Text, View } from "react-native";

interface HistoryCardProps extends ExpenseHistoryItem {
  onPress?: () => void;
}

const HistoryCard = ({
  name,
  icon,
  date,
  amount,
  currency = "USD",
  frequency,
  backgroundColor,
  iconBackgroundColor,
  onPress,
}: HistoryCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-3xl p-4 border border-black/10 active:opacity-90"
      style={{ backgroundColor }}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${date}, ${formatCurrency(amount, currency)} ${frequency}`}
    >
      <View className="flex-1 flex-row items-center">
        <View
          className="size-14 items-center justify-center rounded-2xl p-2.5"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <Image source={icon} className="size-8" resizeMode="contain" />
        </View>

        <View className="ml-3.5 flex-1">
          <Text numberOfLines={1} className="text-lg font-sans-bold text-primary">
            {name}
          </Text>
          <Text numberOfLines={1} className="mt-0.5 text-sm font-sans-medium text-primary/70">
            {date}
          </Text>
        </View>
      </View>

      <View className="shrink-0 items-end pl-3">
        <Text className="text-lg font-sans-bold text-primary">
          {formatCurrency(amount, currency)}
        </Text>
        <Text className="mt-0.5 text-sm font-sans-medium text-primary/70">
          {frequency}
        </Text>
      </View>
    </Pressable>
  );
};

export default HistoryCard;
