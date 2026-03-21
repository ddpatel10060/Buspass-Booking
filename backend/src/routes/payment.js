const express = require("express");
const paymentRouter = express.Router();
const razorpayInstance = require("../util/razorpay");
const Payment = require("../model/payment");
const BusPass = require("../model/busPass");
const { userAuth } = require("../middleware/auth");

// Route: Get Status
paymentRouter.get("/pass/status", userAuth, async (req, res) => {
  try {
    const enrollment = req.user.enrollment;
    const busPass = await BusPass.findOne({ enrollmentNo: enrollment });
    if (busPass && busPass.paymentStatus === 'completed') {
      return res.json({ active: true, expiryDate: busPass.expiryDate });
    }
    res.json({ active: false });
  } catch (error) { res.status(500).json({ error: "Server Error" }); }
});

// Route: Create Order
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  const { amount, stand, city } = req.body;
  if (!amount) return res.status(400).json({ error: "Amount required" });

  try {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: { enrollment: req.user.enrollment, stand, city }
    };
    const order = await razorpayInstance.orders.create(options);
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      notes: order.notes
    });
    await payment.save();
    res.json({ orderId: order.id, keyId: process.env.RAZORPAY_KEY_ID, amount: order.amount, currency: "INR" });
  } catch (err) { res.status(500).json({ error: "Razorpay order failed" }); }
});

// Route: Success Update
paymentRouter.post("/payment/success", userAuth, async (req, res) => {
  const { orderId, paymentId } = req.body;
  try {
    const enrollment = req.user.enrollment;
    await Payment.findOneAndUpdate({ orderId }, { paymentId, status: "paid" });
    
    // Update BusPass
    const busPass = await BusPass.findOneAndUpdate(
      { enrollmentNo: enrollment },
      { paymentStatus: 'completed', paymentRef: paymentId, updatedAt: new Date() },
      { new: true }
    );

    if (!busPass) return res.status(404).json({ error: "Submit Pass Form first!" });
    res.json({ success: true, busPass });
  } catch (err) { res.status(500).json({ error: "Update failed" }); }
});

module.exports = paymentRouter;