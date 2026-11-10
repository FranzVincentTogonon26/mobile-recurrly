import { Text, View } from "react-native";

interface ExpensesCardProps {
  amount: number;
  month: string;
  changePercentage: string;
}

const ExpensesCard = ({
  amount,
  month,
  changePercentage,
}: ExpensesCardProps) => {
  return (
    <View className="rounded-2xl border border-black/10 bg-card p-5 shadow-xs">
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="text-xl font-sans-bold text-primary">Expenses</Text>
        <Text className="text-xl font-sans-bold text-primary">
          -${amount.toFixed(2)}
        </Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-sans-medium text-muted-foreground">
          {month}
        </Text>
        <Text className="text-base font-sans-semibold text-primary/70">
          {changePercentage}
        </Text>
      </View>
    </View>
  );
};

export default ExpensesCard;
