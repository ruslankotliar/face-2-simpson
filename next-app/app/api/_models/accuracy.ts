import mongoose from 'mongoose';

const accuracySchema = new mongoose.Schema(
  {
    accuracy: {
      type: Number,
      required: true,
    },
  },
  {
    // add createdAt and updatedAt timestamps
    timestamps: { createdAt: true, updatedAt: false }
  }
);

const Accuracy =
  mongoose.models.Accuracy || mongoose.model('Accuracy', accuracySchema);

export { Accuracy };
