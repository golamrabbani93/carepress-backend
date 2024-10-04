export interface IPayment {
  paymentId: string
  userId: string
  amount: number
  createdAt?: Date
  updatedAt?: Date
}
