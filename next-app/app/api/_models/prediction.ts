import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    predictionTime: {
      // measured in milliseconds or whichever unit is appropriate
      type: Number,
      required: true,
    },
    characterPredicted: {
      type: String,
      required: true,
    },
    //   userId: {
    //     // associate the prediction with a specific user
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //   },
    imageBucketKey: {
      type: String,
    },
    userFeedback: {
      type: Boolean,
      default: null,
      required: false,
    },
  },
  {
    // add createdAt and updatedAt timestamps
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Prediction =
  mongoose.models.Prediction || mongoose.model('Prediction', predictionSchema);

export { Prediction };
