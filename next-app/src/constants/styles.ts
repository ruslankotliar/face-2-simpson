const CHART_STYLES: { [key: string]: any } = {
  DEFAULT: {
    SOFTENED_COLOR: 'rgba(55, 65, 81, 1)',
    GRID_COLOR: 'rgba(229, 231, 235, 1)',
  },
  PREDICTION_TIME: {
    CHART_COLORS: [
      'rgba(255, 99, 132, 1)', // Red
      'rgba(54, 162, 235, 1)', // Blue
      'rgba(255, 206, 86, 1)', // Yellow
      'rgba(75, 192, 192, 1)', // Cyan
      'rgba(153, 102, 255, 1)', // Purple
      'rgba(255, 159, 64, 1)', // Orange
      'rgba(255, 102, 102, 1)', // Soft Red
      'rgba(102, 255, 102, 1)', // Soft Green
      'rgba(102, 102, 255, 1)', // Soft Blue
      'rgba(178, 102, 255, 1)', // Lavender
      'rgba(255, 255, 102, 1)', // Light Yellow
      'rgba(102, 255, 178, 1)', // Aqua Green
      'rgba(255, 102, 178, 1)', // Pink
      'rgba(102, 178, 255, 1)', // Sky Blue
      'rgba(140, 85, 31, 1)', // Brown
    ],
  },
  CHARACTER_PREDICTED: {
    BACKGROUND: [
      'rgba(255, 99, 132, 0.5)', // Red
      'rgba(54, 162, 235, 0.5)', // Blue
      'rgba(255, 206, 86, 0.5)', // Yellow
      'rgba(75, 192, 192, 0.5)', // Cyan
      'rgba(153, 102, 255, 0.5)', // Purple
      'rgba(255, 159, 64, 0.5)', // Orange
      'rgba(255, 102, 102, 0.5)', // Soft Red
      'rgba(102, 255, 102, 0.5)', // Soft Green
      'rgba(102, 102, 255, 0.5)', // Soft Blue
      'rgba(178, 102, 255, 0.5)', // Lavender
      'rgba(255, 255, 102, 0.5)', // Light Yellow
      'rgba(102, 255, 178, 0.5)', // Aqua Green
      'rgba(255, 102, 178, 0.5)', // Pink
      'rgba(102, 178, 255, 0.5)', // Sky Blue
      'rgba(140, 85, 31, 0.5)', // Brown
    ],
  },
  MODEL_ACCURACY: {
    CHART_COLOR: 'rgba(255, 99, 132, 1)', // Red
  },
};

const PROGRESS_BAR_COLORS = ['yellow', 'red', 'cyan', 'navy', 'lime', 'white'];

export { CHART_STYLES, PROGRESS_BAR_COLORS };
