import mongoose from 'mongoose';

const accuracySchema = new mongoose.Schema(
  {
    accuracy: {
      type: Number, // You could store this as a percentage (e.g., 92.3 for 92.3%) or a fraction (e.g., 0.923 for 92.3%)
      required: true,
    },
  },
  {
    // add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

const Accuracy =
  mongoose.models.Accuracy || mongoose.model('Accuracy', accuracySchema);

export { Accuracy };
