import express, { Router } from 'express'
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth'
import Stripe from 'stripe'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

// Create checkout session
router.post('/checkout/session', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' })
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: req.user?.email,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId: req.user?.uid || '',
      },
    })

    res.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

// Stripe webhook
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return res.status(400).send('Webhook signature verification failed')
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await handleSuccessfulPayment(session)
        break
      
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCancellation(deletedSubscription)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  // TODO: Update user's plan in Firestore
  console.log('Payment successful:', session.id)
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  // TODO: Update subscription status in Firestore
  console.log('Subscription updated:', subscription.id)
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  // TODO: Downgrade user to free plan
  console.log('Subscription cancelled:', subscription.id)
}

export default router
