export const getConsumptionAnalytics = async (consumerId, period = '12months') => {
  try {
    // Mock API Call
    return {
      monthlyConsumption: [
        { month: 'Jan', units: 120 },
        { month: 'Feb', units: 115 },
        { month: 'Mar', units: 130 },
        { month: 'Apr', units: 145 },
        { month: 'May', units: 180 },
        { month: 'Jun', units: 190 },
      ],
      yoyComparison: { thisYear: 1500, lastYear: 1450 },
      peakUsageTime: '18:00 - 22:00',
      similarHouseholdsTarget: 140,
      recommendations: ['Switch to LED bulbs', 'Use AC at 24°C'],
      nextBillPrediction: 1550
    };
  } catch (error) {
    throw new Error('Failed to fetch consumption data');
  }
};
