import { View, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ChartDataPoint } from "@/lib/insights";

interface SpendingTrendChartProps {
  data: ChartDataPoint[];
}

export const SpendingTrendChart = ({ data }: SpendingTrendChartProps) => {
  if (data.length === 0) {
    return (
      <View className="h-64 rounded-2xl border border-border bg-muted flex-items-center justify-center">
        <Text className="text-muted-foreground text-center px-4">No trend data for this period</Text>
      </View>
    );
  }

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [{ data: data.map((d) => d.value), strokeWidth: 3 }],
  };

  const chartConfig = {
    backgroundColor: "#fff9e3",
    backgroundGradientFrom: "#fff9e3",
    backgroundGradientTo: "#fff9e3",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(143, 209, 189, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.5})`,
    style: { borderRadius: 16 },
  };

  return (
    <View className="w-full">
      <LineChart
        data={chartData}
        width={350}
        height={256}
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        yAxisLabel="$"
        yAxisSuffix=""
      />
    </View>
  );
};