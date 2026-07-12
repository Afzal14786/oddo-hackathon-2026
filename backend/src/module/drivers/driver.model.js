import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    licenseCategory: {
      type: String,
      required: [true, 'License category is required'],
      enum: ['A', 'B', 'C', 'D', 'E', 'F'],
    },
    licenseExpiryDate: {
      type: Date,
      required: [true, 'License expiry date is required'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    safetyScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['available', 'on_trip', 'off_duty', 'suspended'],
      default: 'available',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
driverSchema.index({ status: 1 });
driverSchema.index({ licenseExpiryDate: 1 });

driverSchema.methods.isLicenseValid = function () {
  return (
    this.status !== 'suspended' &&
    this.licenseExpiryDate > new Date()
  );
};

export const Driver = mongoose.model('Driver', driverSchema);