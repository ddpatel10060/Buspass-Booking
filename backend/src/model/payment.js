const express = require("express");
const paymentRouter = express.Router(); // Yeh line define hona zaroori hai
const razorpayInstance = require("../util/razorpay");
const Payment = require("../model/payment");
const BusPass = require("../model/busPass");
const User = require("../model/signup.user");
const SystemConfig = require("../model/SystemConfig");
const { userAuth } = require("../middleware/auth");

// Helper to add days
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// 1. Status Check Route (Refresh Issue Fix)
paymentRouter.get("/pass/status", userAuth, async (req, res) => {
  try {
    const enrollment = req.user.enrollment;
    const busPass = await BusPass.findOne({ enrollmentNo: enrollment });

    if (busPass && busPass.paymentStatus === 'completed') {
      return res.json({ 
        active: true, 
        expiryDate: busPass.expiryDate 
      });
    }
    res.json({ active: false });
  } catch (error) {
    res.status(500).json({ error: "Status check failed" });
  }
});

// 2. Create Razorpay Order
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  const { amount, currency = "INR", receipt, stand, city } = req.body;

  if (!amount) {
    return res.status(400).json({ error: "Amount is required" });
  }

  try {
    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        name: req.user.name,
        email: req.user.email,
        enrollment: req.user.enrollment,
        stand: stand || "",
        city: city || ""
      },
    };

    const order = await razorpayInstance.orders.create(options);

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();

    res.json({
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      payment: savedPayment,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

// 3. Payment Success & Database Update
paymentRouter.post("/payment/success", userAuth, async (req, res) => {
  const { orderId, paymentId, status } = req.body;

  if (!orderId || !paymentId) {
    return res.status(400).json({ error: "orderId and paymentId are required" });
  }

  try {
    const user = req.user;
    const enrollment = user.enrollment;

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { orderId },
      { paymentId, status: status || "paid" },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    // Find existing BusPass and update
    let busPass = await BusPass.findOne({ enrollmentNo: enrollment });

    if (!busPass) {
      return res.status(404).json({ error: "Bus pass application not found. Please submit form first." });
    }

    const endDateStr = await SystemConfig.getConfig("passEndDate", null);
    let expiryDate = endDateStr ? new Date(endDateStr) : addDays(new Date(), 180);

    busPass.paymentRef = paymentId;
    busPass.expiryDate = expiryDate;
    busPass.paymentStatus = 'completed';
    busPass.updatedAt = new Date();
    busPass.userId = user._id;

    await busPass.save();

    return res.json({ success: true, busPass });
  } catch (error) {
    console.error("Error in /payment/success:", error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = paymentRouter;