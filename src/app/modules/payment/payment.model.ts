import mongoose from 'mongoose'
import { IPayment } from './payment.interface'

const PaymentSchema = new mongoose.Schema<IPayment>(
  {
    paymentId: { type: String, required: true },
    userId: { type: String, required: true, ref: 'User' },
    amount: { type: Number, required: true },
  },
  { timestamps: true },
)

export const Payment = mongoose.model('Payment', PaymentSchema)
