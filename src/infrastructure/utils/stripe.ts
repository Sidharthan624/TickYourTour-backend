import { StreamState } from 'http2'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET as string)

class StripePayment {
    async makePayment(totalPrice: number) {
        let line_items = [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: "test"
                    },
                    unit_amount: totalPrice * 100
                },
                quantity: 1
            }
        ]
        const session = await stripe.checkout.sessions.create({
            success_url: 'http://localhost:5173/paymentSuccess',
            cancel_url: 'http://localhost:5173/paymentFail',
            line_items: line_items,
            mode: 'payment',
            billing_address_collection: 'required'
        })
        return session.id
    }
    async makeSubscription(providerId: string): Promise<string> {
        try {
            const line_items = [{
                price: process.env.MONTHLY_SUBSCRIPTION_PRICE_ID as string,
                quantity: 1
            }]
            const session = await stripe.checkout.sessions.create({
                success_url: 'http://localhost:5173/provider/paymentSuccess',
                cancel_url: 'http://localhost:5173/provider/paymentFail',
                payment_method_types: ['card'],
                mode: 'subscription',
                line_items: line_items,
                billing_address_collection: 'required',
                metadata: { providerId }
            })
            return session.id
        } catch (error) {
            console.error(error);
            throw error
        }
    }
    async refundPayment(paymentId: string) {
        try {
            const paymentIntentResponse = await stripe.paymentIntents.retrieve(paymentId)
            const chargeId = paymentIntentResponse.latest_charge
            const refund = await stripe.refunds.create({
                charge: chargeId as string
            })
            return refund
        } catch (error) {
            console.error(error);
            
        }
    }
    async cancelSubscription(subscriptionId: string) {
        try {
            const cancel = await stripe.subscriptions.cancel(subscriptionId)
            if(cancel) {
                return true
            }
            return false
        } catch (error) {
            console.error(error);
            
        }
    }
}
export default StripePayment