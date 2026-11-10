import { clsx } from "clsx";
import { Pressable, Text, View } from "react-native";

export type PeriodOption = "This Month" | "Last Month" | "Last 3 Months";

interface PeriodSelectorProps {
  selectedPeriod: PeriodOption;
  onChange: (period: PeriodOption) => void;
  options?: PeriodOption[];
}

const DEFAULT_OPTIONS: PeriodOption[] = [
  "This Month",
  "Last Month",
  "Last 3 Months",
];

const PeriodSelector = ({
  selectedPeriod,
  onChange,
  options = DEFAULT_OPTIONS,
}: PeriodSelectorProps) => {
  return (
    <View className="flex-row rounded-2xl border border-black/10 bg-card p-1">
      {options.map((option) => {
        const isSelected = selectedPeriod === option;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            className={clsx(
              "flex-1 items-center justify-center rounded-xl py-2",
              isSelected ? "bg-accent" : "bg-transparent",
            )}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              className={clsx(
                "text-xs font-sans-bold",
                isSelected ? "text-background" : "text-primary",
              )}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default PeriodSelector;
