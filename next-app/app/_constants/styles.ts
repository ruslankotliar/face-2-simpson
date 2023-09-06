const CHART_STYLES: { [key: string]: any } = {
  DEFAULT: {
    SOFTENED_COLOR: 'rgba(55, 65, 81, 1)',
    GRID_COLOR: 'rgba(229, 231, 235, 1)',
  },
  PREDICTION_TIME: {
    CHART_COLOR: 'rgba(93, 156, 236, 1)',
  },
  CHARACTER_PREDICTED: {
    BACKGROUND: [
      // Add as many colors as you think you might need, or create a dynamic color generator.
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(255, 159, 64, 0.5)',
    ],
  },
  MODEL_ACCURACY: {
    CHART_COLOR: 'rgba(255, 99, 132, 1)',
  },
};

export { CHART_STYLES };
