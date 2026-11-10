import { chartConfig } from "@/lib/chart-config";
import type { DailySpending } from "@/lib/insights";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

interface SpendingBarChartProps {
  data: DailySpending[];
  defaultSelectedDay?: string;
  onSelectDay?: (day: DailySpending) => void;
}

const TICKS = chartConfig.ticks; // [45, 35, 25, 5, 0]
const MAX_VALUE = chartConfig.maxSpendingValue; // 45
const CHART_HEIGHT = 160;

const SpendingBarChart = ({
  data,
  defaultSelectedDay = "Thr",
  onSelectDay,
}: SpendingBarChartProps) => {
  const [selectedDayName, setSelectedDayName] = useState(defaultSelectedDay);

  const handleBarPress = (item: DailySpending) => {
    setSelectedDayName(item.day);
    onSelectDay?.(item);
  };

  return (
    <View className="rounded-3xl bg-[#f7f0da] p-5 border border-black/10 shadow-xs">
      <View style={{ height: CHART_HEIGHT, flexDirection: "row" }}>
        {/* Y-Axis Labels */}
        <View
          style={{
            width: 28,
            height: CHART_HEIGHT,
            justifyContent: "space-between",
            paddingBottom: 2,
            alignItems: "flex-start",
          }}
        >
          {TICKS.map((tick) => (
            <Text
              key={tick}
              style={{
                fontSize: 12,
                fontFamily: "sans-medium",
                color: "rgba(8, 17, 38, 0.55)",
              }}
            >
              {tick}
            </Text>
          ))}
        </View>

        {/* Chart Area with Grid Lines and Bars */}
        <View style={{ flex: 1, height: CHART_HEIGHT, position: "relative" }}>
          {/* Dashed Grid Lines across chart */}
          {TICKS.map((tick) => {
            // Calculate top position of the gridline
            const topPosition =
              ((MAX_VALUE - tick) / MAX_VALUE) * (CHART_HEIGHT - 14) + 6;
            return (
              <View
                key={tick}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: topPosition,
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(0, 0, 0, 0.08)",
                  borderStyle: "dashed",
                }}
              />
            );
          })}

          {/* Bars Row */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              paddingBottom: 6,
            }}
          >
            {data.map((item) => {
              const isSelected = item.day === selectedDayName;
              // Max bar height available is ~135px so tooltip has room above 40
              const maxBarHeight = CHART_HEIGHT - 38;
              const barHeight = Math.max(
                12,
                (Math.min(item.amount, MAX_VALUE) / MAX_VALUE) * maxBarHeight,
              );

              return (
                <Pressable
                  key={item.day}
                  onPress={() => handleBarPress(item)}
                  hitSlop={{ top: 15, bottom: 15, left: 8, right: 8 }}
                  style={{
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: 28,
                    height: "100%",
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.day}: $${item.amount}`}
                >
                  {/* Tooltip Bubble */}
                  {isSelected && (
                    <View
                      style={{
                        position: "absolute",
                        bottom: barHeight + 4,
                        alignItems: "center",
                        zIndex: 10,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#ffffff",
                          borderRadius: 999,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          minWidth: 40,
                          alignItems: "center",
                          justifyContent: "center",
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.12,
                          shadowRadius: 2,
                          elevation: 2,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontFamily: "sans-bold",
                            color: "#ea7a53",
                          }}
                        >
                          ${item.amount}
                        </Text>
                      </View>
                      {/* Triangle pointer */}
                      <View
                        style={{
                          width: 0,
                          height: 0,
                          borderLeftWidth: 4,
                          borderRightWidth: 4,
                          borderTopWidth: 4,
                          borderLeftColor: "transparent",
                          borderRightColor: "transparent",
                          borderTopColor: "#ffffff",
                        }}
                      />
                    </View>
                  )}

                  {/* The Bar */}
                  <View
                    style={{
                      width: 10,
                      height: barHeight,
                      borderRadius: 5,
                      backgroundColor: isSelected ? "#ea7a53" : "#081126",
                    }}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {/* X-Axis Day Labels */}
      <View
        style={{
          flexDirection: "row",
          paddingLeft: 28,
          paddingRight: 0,
          marginTop: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
        >
          {data.map((item) => {
            const isSelected = item.day === selectedDayName;
            return (
              <View
                key={item.day}
                style={{
                  width: 28,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: isSelected ? "sans-bold" : "sans-medium",
                    color: isSelected ? "#081126" : "rgba(8, 17, 38, 0.6)",
                  }}
                >
                  {item.day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default SpendingBarChart;
