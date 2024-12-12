export function calculateUpdatedCategoryStats(
  currentStats: Array<{ category: string; count: number }>,
  oldCategory: string,
  newCategory: string
) {
  return currentStats.map(stat => {
    if (stat.category === oldCategory) {
      return { ...stat, count: stat.count - 1 };
    }
    if (stat.category === newCategory) {
      return { ...stat, count: stat.count + 1 };
    }
    return stat;
  });
} 