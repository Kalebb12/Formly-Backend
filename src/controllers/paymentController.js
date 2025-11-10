import Plan from "../models/Plan.js";
import User from "../models/User.js";
import stripe from "../utils/stripe.js";
export const createCheckoutSession = async (req, res) => {
  try {
    const { planId } = req.body;
    const user_id = req.user_id;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    const user = await User.findById(user_id);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: user.email,

      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating checkout session" });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const user = await User.findOne({ email: session.customer_email });
      if (!user) return res.status(404).send();

      const plan = await Plan.findOne({ name: session.amount_subtotal });
      user.subscription = {
        plan: plan._id,
        status: "active",
        stripeCustomerId: session.customer,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };

      await user.save();
      break;
    }

    case "customer.subscription.canceled":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const stripeCustomerId = subscription.customer;

      try {
        const user = await User.findOne({
          "subscription.stripeCustomerId": stripeCustomerId,
        });
        if (!user) {
          console.log(`User not found for customer ID: ${stripeCustomerId}`);
          return res.status(200).send(); // Return 200 even if user not found to acknowledge receipt
        }

        const plan = await Plan.findOne({ name: "Free" });
        user.subscription = {
          plan: plan._id,
          status: "inactive",
          stripeCustomerId: stripeCustomerId,
          currentPeriodEnd: Date.now(),
        };

        await user.save();
        console.log(
          `Subscription status updated to inactive for user: ${user.email}`
        );
      } catch (error) {
        console.error("Error updating subscription status:", error);
        // Still return 200 to acknowledge receipt of webhook
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const stripeCustomerId = invoice.customer;
      const subscriptionId = invoice.subscription;

      try {
        // Only update status if this is the final payment attempt
        // Check the number of payment attempts or your dunning settings
        const attemptCount = invoice.attempt_count;
        const maxAttempts = 3; // Adjust based on your dunning settings

        if (attemptCount >= maxAttempts) {
          const user = await User.findOne({
            "subscription.stripeCustomerId": stripeCustomerId,
          });
          if (!user) {
            console.log(`User not found for customer ID: ${stripeCustomerId}`);
            return res.status(200).send();
          }

          const plan = await Plan.findOne({ name: "Free" });
          user.subscription = {
            plan: plan._id,
            status: "past_due", // Consider using past_due instead of immediately inactive
            stripeCustomerId: stripeCustomerId,
            currentPeriodEnd: Date.now(),
          };

          await user.save();
          console.log(
            `Subscription marked as past_due for user: ${user.email}`
          );
        } else {
          console.log(
            `Payment failed but still has ${
              maxAttempts - attemptCount
            } attempts remaining`
          );
        }
      } catch (error) {
        console.error("Error handling failed payment:", error);
        // Still return 200 to acknowledge receipt of webhook
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
