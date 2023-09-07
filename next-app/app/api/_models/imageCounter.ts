import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 },
});

const ImageCounter =
  mongoose.models.ImageCounter || mongoose.model('ImageCounter', counterSchema);

export { ImageCounter };
