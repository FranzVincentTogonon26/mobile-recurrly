import ListHeading from "@/components/ListHeading";
import {
  ExpensesCard,
  HistoryCard,
  SpendingBarChart,
} from "@/components/insights";
import { icons } from "@/constants/icons";
import {
  MONTHLY_INSIGHTS,
  type DailySpending,
  type ExpenseHistoryItem,
} from "@/lib/insights";
import { router } from "expo-router";
import { cssInterop } from "nativewind";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

cssInterop(SafeAreaView, { className: "style" });

const Insights = () => {
  const [weeklyData] = useState<DailySpending[]>(
    MONTHLY_INSIGHTS.weeklySpending,
  );
  const [historyData] = useState<ExpenseHistoryItem[]>(
    MONTHLY_INSIGHTS.history,
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleOptions = () => {
    Alert.alert("Monthly Insights", "Options", [
      {
        text: "Export Summary",
        onPress: () => Alert.alert("Export", "Insights summary exported."),
      },
      {
        text: "Select Month",
        onPress: () => Alert.alert("Select Month", "Showing March 2026 data."),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleHistoryItemPress = (item: ExpenseHistoryItem) => {
    Alert.alert(
      item.name,
      `Billed on ${item.date} for $${item.amount.toFixed(2)} (${item.frequency}).`,
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-2">
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HistoryCard
            {...item}
            onPress={() => handleHistoryItemPress(item)}
          />
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={() => (
          <>
            {/* Top Navigation Header */}
            <View className="mb-4 flex-row items-center justify-between">
              <Pressable
                onPress={handleBack}
                className="size-12 items-center justify-center rounded-full border border-border bg-card active:opacity-70"
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Image
                  source={icons.back}
                  className="size-4"
                  resizeMode="contain"
                />
              </Pressable>

              <Text className="text-2xl font-sans-bold text-primary">
                Monthly Insights
              </Text>

              <Pressable
                onPress={handleOptions}
                className="size-12 items-center justify-center rounded-full border border-border bg-card active:opacity-70"
                accessibilityRole="button"
                accessibilityLabel="Options"
              >
                <Image
                  source={icons.menu}
                  className="size-4"
                  resizeMode="contain"
                />
              </Pressable>
            </View>

            {/* Upcoming Section */}
            <View className="mb-3">
              <ListHeading title="Upcoming" />
              <SpendingBarChart data={weeklyData} defaultSelectedDay="Thr" />
            </View>

            {/* Expenses Card */}
            <View className="my-4">
              <ExpensesCard
                amount={MONTHLY_INSIGHTS.totalExpenses}
                month={MONTHLY_INSIGHTS.month}
                changePercentage={MONTHLY_INSIGHTS.changePercentage}
              />
            </View>

            {/* History Section Heading */}
            <View className="mb-3">
              <ListHeading title="History" />
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Insights;
