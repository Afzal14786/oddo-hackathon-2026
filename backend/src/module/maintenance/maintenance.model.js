import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required'],
    },
    type: {
      type: String,
      enum: ['oil_change', 'tyre_replacement', 'brake_service', 'engine_repair', 'general_service', 'other'],
      required: [true, 'Maintenance type is required'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    cost: {
      type: Number,
      required: [true, 'Cost is required'],
      min: [0, 'Cost cannot be negative'],
    },
    closed: {
      type: Boolean,
      default: false,
    },
    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// indexes
maintenanceSchema.index({ vehicleId: 1, closed: 1 });
maintenanceSchema.index({ vehicleId: 1, date: -1 });

export const Maintenance = mongoose.model('Maintenance', maintenanceSchema);