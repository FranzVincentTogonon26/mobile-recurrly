import { icons } from "@/constants/icons";
import { clsx } from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

type Category = (typeof CATEGORIES)[number];
type Frequency = "Monthly" | "Yearly";

const CATEGORY_COLORS: Record<Category, string> = {
  Entertainment: "#ffd1b3",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#b8e8d0",
  Productivity: "#fde68a",
  Cloud: "#bfdbfe",
  Music: "#fed7aa",
  Other: "#e2e8f0",
};

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [category, setCategory] = useState<Category>("Entertainment");

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const parsedPrice = parseFloat(price.trim());
  const isValid =
    name.trim().length > 0 &&
    price.trim().length > 0 &&
    !isNaN(parsedPrice) &&
    parsedPrice > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    const now = dayjs();
    const renewal =
      frequency === "Yearly" ? now.add(1, "year") : now.add(1, "month");

    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      name: name.trim(),
      price: parsedPrice,
      frequency,
      category,
      status: "active",
      startDate: now.toISOString(),
      renewalDate: renewal.toISOString(),
      icon: icons.wallet,
      billing: frequency,
      color: CATEGORY_COLORS[category] ?? "#fff8e7",
      currency: "USD",
      plan: `${frequency} Plan`,
    };

    onSubmit(newSubscription);
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="modal-overlay"
      >
        <Pressable
          className="flex-1"
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss modal overlay"
        />

        <View className="modal-container">
          {/* Header */}
          <View className="modal-header">
            <Text className="modal-title">New Subscription</Text>
            <Pressable
              onPress={handleClose}
              className="modal-close"
              accessibilityRole="button"
              accessibilityLabel="Close modal"
            >
              <Text className="modal-close-text">✕</Text>
            </Pressable>
          </View>

          {/* Form */}
          <ScrollView
            className="modal-body"
            contentContainerStyle={{ gap: 20, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Name */}
            <View className="auth-field">
              <Text className="auth-label">Name</Text>
              <View className="auth-input-wrap">
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Netflix, Spotify, GitHub"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  className="auth-input"
                  autoCapitalize="words"
                  autoCorrect={false}
                  accessibilityLabel="Name"
                />
              </View>
            </View>

            {/* Price */}
            <View className="auth-field">
              <Text className="auth-label">Price</Text>
              <View className="auth-input-wrap">
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  className="auth-input"
                  keyboardType="decimal-pad"
                  accessibilityLabel="Price"
                />
              </View>
            </View>

            {/* Frequency */}
            <View className="auth-field">
              <Text className="auth-label">Frequency</Text>
              <View className="picker-row">
                {(["Monthly", "Yearly"] as const).map((freq) => {
                  const isSelected = frequency === freq;
                  return (
                    <Pressable
                      key={freq}
                      onPress={() => setFrequency(freq)}
                      className={clsx(
                        "picker-option",
                        isSelected && "picker-option-active",
                      )}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          isSelected && "picker-option-text-active",
                        )}
                      >
                        {freq}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Category */}
            <View className="auth-field">
              <Text className="auth-label">Category</Text>
              <View className="category-scroll">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={clsx(
                        "category-chip",
                        isSelected && "category-chip-active",
                      )}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          isSelected && "category-chip-text-active",
                        )}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={!isValid}
              className={clsx(
                "auth-button",
                !isValid && "auth-button-disabled",
              )}
              accessibilityRole="button"
              accessibilityState={{ disabled: !isValid }}
            >
              <Text className="auth-button-text">Create Subscription</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;
