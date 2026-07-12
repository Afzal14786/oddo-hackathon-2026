import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['truck', 'van', 'bus', 'car', 'motorcycle', 'other'],
      required: [true, 'Vehicle type is required'],
    },
    maxLoadCapacity: {
      type: Number,
      required: [true, 'Maximum load capacity is required'],
      min: [0, 'Capacity cannot be negative'],
    },
    odometer: {
      type: Number,
      default: 0,
      min: [0, 'Odometer cannot be negative'],
    },
    acquisitionCost: {
      type: Number,
      required: [true, 'Acquisition cost is required'],
      min: [0, 'Cost cannot be negative'],
    },
    status: {
      type: String,
      enum: ['available', 'on_trip', 'in_shop', 'retired'],
      default: 'available',
      required: true,
    },
    region: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

vehicleSchema.index({ status: 1 });
vehicleSchema.index({ type: 1 });

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);