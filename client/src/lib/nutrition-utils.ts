// Utility functions for nutrition calculations and display

// Calculate daily value percentage
export function calculateDailyValuePercentage(
  value: number,
  referenceValue: number
): number {
  return Math.round((value / referenceValue) * 100);
}

// Daily reference values for common nutrients (based on 2000 calorie diet)
export const dailyReferenceValues = {
  calories: 2000,
  fat: 65, // g
  saturatedFat: 20, // g
  cholesterol: 300, // mg
  sodium: 2400, // mg
  carbs: 300, // g
  fiber: 25, // g
  protein: 50, // g
  calcium: 1000, // mg
  iron: 18, // mg
  vitaminD: 20, // mcg
};

// Convert range string to min/max values
export function parseNutrientRange(
  rangeString: string
): { min?: number; max?: number } {
  if (!rangeString) return {};

  if (rangeString.endsWith("+")) {
    const min = parseInt(rangeString.replace("+", ""));
    return { min };
  }

  const [min, max] = rangeString.split("-").map(n => parseInt(n));
  return { min, max };
}

// Format nutrition value with units
export function formatNutritionValue(value: number | null | undefined, unit: string): string {
  if (value === null || value === undefined) return "-";
  return `${value}${unit}`;
}

// Get color class for nutritional value indicators
export function getNutrientColorClass(
  nutrient: "calories" | "protein" | "carbs" | "fat",
  value: number
): string {
  switch (nutrient) {
    case "calories":
      return "bg-primary";
    case "protein":
      return "bg-green-500";
    case "carbs":
      return "bg-blue-500";
    case "fat":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
}
