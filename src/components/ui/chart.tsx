import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

// Some chart-kit packages don't expose guaranteed TypeScript types in all versions —
// cast the components to `any` locally to avoid breaking the build where needed.
const LineChartAny: any = LineChart;
const BarChartAny: any = BarChart;
const PieChartAny: any = PieChart;

const screenWidth = Dimensions.get("window").width;

export type ChartConfig = {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
  }[];
};

type Props = {
  title?: string;
  data: ChartConfig;
  type?: "line" | "bar" | "pie";
};

export default function ChartContainer({
  title,
  data,
  type = "line",
}: Props) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      {type === "line" && (
        <LineChartAny
          data={data}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      )}

      {type === "bar" && (
        <BarChartAny
          data={data}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      )}

      {type === "pie" && (
        <PieChartAny
          data={data.datasets.map((d, i) => ({
            name: data.labels[i],
            population: d.data[0] ?? 0,
            color: d.color ? d.color(1) : "#9333ea",
            legendFontColor: "#333",
            legendFontSize: 12,
          }))}
          width={screenWidth - 32}
          height={220}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft={16}
          chartConfig={chartConfig}
          style={styles.chart}
        />
      )}
    </View>
  );
}

const chartConfig: any = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(147, 51, 234, ${opacity})`,
  labelColor: () => "#6b7280",
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },
  chart: {
    borderRadius: 16,
  },
});
