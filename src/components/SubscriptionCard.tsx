import {
  formatCurrency,
  formatStatusLabel,
  formatSubscriptionDateTime,
} from "@/lib/utils";
import { clsx } from "clsx";
import { Image, Pressable, Text, View } from "react-native";

const SubscriptionCard = ({
  name,
  price,
  currency,
  icon,
  billing,
  color,
  category,
  plan,
  renewalDate,
  expanded,
  onPress,
  paymentMethod,
  startDate,
  status,
  onCancelPress,
  isCancelling,
  onManagePress,
  onChangePlanPress,
}: SubscriptionCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className={clsx("sub-card", expanded ? "sub-card-expanded" : "bg-card")}
      style={!expanded && color ? { backgroundColor: color } : undefined}
    >
      <View className="sub-head">
        <View className="sub-main">
          <Image source={icon} className="sub-icon" />
          <View className="sub-copy">
            <Text numberOfLines={1} className="sub-title">
              {name}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" className="sub-meta">
              {category?.trim() ||
                plan?.trim() ||
                (renewalDate ? formatSubscriptionDateTime(renewalDate) : "")}
            </Text>
          </View>
        </View>

        <View className="sub-price-box">
          <Text className="sub-price">{formatCurrency(price, currency)}</Text>
          <Text className="sub-billing">{billing}</Text>
        </View>
      </View>

      {expanded && (
        <View className="sub-body">
          <View className="sub-details">
            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Payment info:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {paymentMethod?.trim() ?? "Not provided"}
                </Text>
              </View>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  onManagePress?.();
                }}
                className="rounded-full border border-primary px-4 py-1.5 active:bg-primary/10"
                accessibilityRole="button"
                accessibilityLabel="Manage payment info"
              >
                <Text className="text-sm font-sans-medium text-primary">
                  Manage
                </Text>
              </Pressable>
            </View>

            <View className="sub-row">
              <View className="sub-row-copy">
                <Text className="sub-label">Plan details:</Text>
                <Text
                  className="sub-value"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {(plan?.trim() || category?.trim()) ?? "Not provided"}
                </Text>
              </View>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  onChangePlanPress?.();
                }}
                className="rounded-full border border-primary px-4 py-1.5 active:bg-primary/10"
                accessibilityRole="button"
                accessibilityLabel="Change plan details"
              >
                <Text className="text-sm font-sans-medium text-primary">
                  Change
                </Text>
              </Pressable>
            </View>

            {startDate ? (
              <View className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">Started:</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {formatSubscriptionDateTime(startDate)}
                  </Text>
                </View>
              </View>
            ) : null}

            {renewalDate ? (
              <View className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">Renewal date:</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {formatSubscriptionDateTime(renewalDate)}
                  </Text>
                </View>
              </View>
            ) : null}

            {status ? (
              <View className="sub-row">
                <View className="sub-row-copy">
                  <Text className="sub-label">Status:</Text>
                  <Text
                    className="sub-value"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {formatStatusLabel(status)}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          <Pressable
            onPress={(e) => {
              e.stopPropagation?.();
              onCancelPress?.();
            }}
            disabled={isCancelling}
            className={clsx(
              "sub-cancel",
              isCancelling && "sub-cancel-disabled",
            )}
            accessibilityRole="button"
            accessibilityLabel="Cancel subscription"
          >
            <Text className="sub-cancel-text">
              {isCancelling ? "Cancelling..." : "Cancel Subscription"}
            </Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};
export default SubscriptionCard;
