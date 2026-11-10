import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { FlatList, Image, Text, View } from "react-native";

import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import { cssInterop } from "nativewind";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
cssInterop(SafeAreaView, { className: "style" });

export default function App() {
  // const { user } = useUser();
  // const posthog = usePostHog();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const { subscriptions, addSubscription } = useSubscriptionStore();

  // Get upcoming subscriptions (active subscriptions with renewal date within next 7 days)
  // const upcomingSubscriptions = useMemo(() => {
  //   const now = dayjs();
  //   const nextWeek = now.add(7, "days");
  //   return subscriptions
  //     .filter(
  //       (sub) =>
  //         sub.status === "active" &&
  //         dayjs(sub.renewalDate).isAfter(now) &&
  //         dayjs(sub.renewalDate).isBefore(nextWeek),
  //     )
  //     .sort((a, b) => dayjs(a.renewalDate).diff(dayjs(b.renewalDate)));
  // }, [subscriptions]);

  const handleSubscriptionPress = (item: Subscription) => {
    setExpandedSubscriptionId((currentId) =>
      currentId === item.id ? null : item.id,
    );
  };

  // const handleCreateSubscription = (newSubscription: Subscription) => {
  //   addSubscription(newSubscription);
  //   posthog.capture("subscription_created", {
  //     subscription_name: newSubscription.name,
  //     subscription_price: newSubscription.price,
  //     subscription_frequency: newSubscription.frequency,
  //     subscription_category: newSubscription.category,
  //   });
  // };

  // Get user display name: firstName, fullName, or email
  // const displayName =
  //   user?.firstName ||
  //   user?.fullName ||
  //   user?.emailAddresses[0]?.emailAddress ||
  //   "User";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={images.avatar} className="home-avatar" />
                <Text className="home-user-name">{HOME_USER.name}</Text>
              </View>

              {/* <Pressable onPress={() => setIsModalVisible(true)}> */}
              <Image source={icons.add} className="home-add-icon" />
              {/* </Pressable> */}
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />

              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals yet.
                  </Text>
                }
              />
            </View>

            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => handleSubscriptionPress(item)}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions yet.</Text>
        }
        contentContainerClassName="pb-20"
      />

      {/* <CreateSubscriptionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateSubscription}
      /> */}
    </SafeAreaView>
  );
}
