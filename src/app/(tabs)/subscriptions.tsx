import SubscriptionCard from "@/components/SubscriptionCard";
import { SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { router } from "expo-router";
import { cssInterop } from "nativewind";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

cssInterop(SafeAreaView, { className: "style" });

const SearchIcon = () => (
  <View
    style={{
      width: 18,
      height: 18,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "rgba(8, 17, 38, 0.6)",
        marginBottom: 2,
        marginRight: 2,
      }}
    />
    <View
      style={{
        position: "absolute",
        bottom: 1,
        right: 1,
        width: 2,
        height: 6,
        borderRadius: 1,
        backgroundColor: "rgba(8, 17, 38, 0.6)",
        transform: [{ rotate: "-45deg" }],
      }}
    />
  </View>
);

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(SUBSCRIPTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >("github-copilot");

  const filteredSubscriptions = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return subscriptions;

    return subscriptions.filter((sub) => {
      const matchName = sub.name.toLowerCase().includes(trimmed);
      const matchPlan = sub.plan?.toLowerCase().includes(trimmed);
      const matchCategory = sub.category?.toLowerCase().includes(trimmed);
      const matchBilling = sub.billing.toLowerCase().includes(trimmed);
      return matchName || matchPlan || matchCategory || matchBilling;
    });
  }, [subscriptions, searchQuery]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleOptionsPress = () => {
    Alert.alert("Subscription Options", "Choose an option", [
      {
        text: "Sort by Name (A-Z)",
        onPress: () =>
          setSubscriptions((prev) =>
            [...prev].sort((a, b) => a.name.localeCompare(b.name)),
          ),
      },
      {
        text: "Sort by Price (High to Low)",
        onPress: () =>
          setSubscriptions((prev) =>
            [...prev].sort((a, b) => b.price - a.price),
          ),
      },
      {
        text: "Reset to Default",
        onPress: () => setSubscriptions(SUBSCRIPTIONS),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSubscriptionPress = (item: Subscription) => {
    setExpandedSubscriptionId((currentId) =>
      currentId === item.id ? null : item.id,
    );
  };

  const handleCancelSubscription = (item: Subscription) => {
    Alert.alert(
      "Cancel Subscription",
      `Are you sure you want to cancel your ${item.name} subscription?`,
      [
        { text: "Keep Subscription", style: "cancel" },
        {
          text: "Cancel Subscription",
          style: "destructive",
          onPress: () => {
            setSubscriptions((prev) =>
              prev.map((sub) =>
                sub.id === item.id ? { ...sub, status: "cancelled" } : sub,
              ),
            );
            Alert.alert(
              "Subscription Cancelled",
              `Your ${item.name} subscription has been cancelled.`,
            );
          },
        },
      ],
    );
  };

  const handleManage = (item: Subscription) => {
    Alert.alert(
      "Payment Info",
      `Current payment method for ${item.name}: ${item.paymentMethod || "Not provided"}`,
    );
  };

  const handleChangePlan = (item: Subscription) => {
    Alert.alert(
      "Plan Details",
      `Current plan for ${item.name}: ${item.plan || item.category || "Standard"}`,
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-2">
      {/* Top Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <Pressable
          onPress={handleBack}
          className="size-12 items-center justify-center rounded-full border border-border bg-card active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Image source={icons.back} className="size-4" resizeMode="contain" />
        </Pressable>

        <Text className="text-2xl font-sans-bold text-primary">
          My Subscriptions
        </Text>

        <Pressable
          onPress={handleOptionsPress}
          className="size-12 items-center justify-center rounded-full border border-border bg-card active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <Image source={icons.menu} className="size-4" resizeMode="contain" />
        </Pressable>
      </View>

      {/* Search Bar */}
      <View className="mb-4 flex-row items-center rounded-2xl border border-border bg-card px-4 py-3">
        <SearchIcon />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search subscriptions..."
          placeholderTextColor="rgba(0, 0, 0, 0.4)"
          className="ml-2.5 flex-1 text-base font-sans-medium text-primary"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => setSearchQuery("")}
            hitSlop={10}
            className="size-5 items-center justify-center rounded-full bg-black/10 active:opacity-60"
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Text className="text-xs font-sans-bold text-primary/70">✕</Text>
          </Pressable>
        )}
      </View>

      {/* Subscriptions List */}
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => handleSubscriptionPress(item)}
            onCancelPress={() => handleCancelSubscription(item)}
            onManagePress={() => handleManage(item)}
            onChangePlanPress={() => handleChangePlan(item)}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          searchQuery.trim().length > 0 ? (
            <View className="items-center justify-center py-12 px-4">
              <Text className="text-center text-lg font-sans-bold text-primary">
                No subscriptions found
              </Text>
              <Text className="mt-1 text-center text-sm font-sans-medium text-muted-foreground">
                We couldn&apos;t find any results matching &quot;{searchQuery}
                &quot;.
              </Text>
              <Pressable
                onPress={() => setSearchQuery("")}
                className="mt-4 rounded-full border border-border bg-card px-4 py-2 active:opacity-70"
              >
                <Text className="text-sm font-sans-semibold text-primary">
                  Clear search
                </Text>
              </Pressable>
            </View>
          ) : (
            <Text className="home-empty-state text-center">
              No subscriptions yet.
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
