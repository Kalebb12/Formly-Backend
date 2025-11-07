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
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const user = await User.findOne({ email: session.customer_email });
    if (!user) return res.status(404).send();

    const plan = await Plan.findOne({ price: session.amount_total});
    user.subscription = {
      plan: plan._id,
      status: "active",
      stripeCustomerId: session.customer,
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    await user.save();
  }

  res.json({ received: true });
};
