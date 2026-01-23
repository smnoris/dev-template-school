import { Schema, model, models, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => {
          // Email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to validate that the referenced event exists
 * Prevents orphaned bookings by ensuring eventId references a valid Event document
 */
(BookingSchema as any).pre('save', async function(this: IBooking, next: (err?: any) => void) {
  if (this.isModified('eventId')) {
    try {
      // Dynamically import Event model to avoid circular dependency
      const Event = models.Event || (await import('./event.model')).default;
      
      const eventExists = await Event.findById(this.eventId);
      
      if (!eventExists) {
        return next(new Error('Referenced event does not exist'));
      }
    } catch {
      return next(new Error('Failed to validate event reference'));
    }
  }
  
  next();
});

// Index on eventId for faster booking queries by event
BookingSchema.index({ eventId: 1 });

const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
