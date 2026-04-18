import User from "../models/User.js";

// Farmer uploads document
export const uploadVerificationDoc = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log("User from DB:", user);

    if (user.userType !== "farmer") {
      return res.status(403).json({
        message: "Only farmers can upload verification document",
      });
    }

    console.log("Received document URL:", req.body);

    // Here we receive file URL (we’ll simplify for now)
    user.verification.document = req.body.documentUrl;
    user.verification.status = "pending";

    await user.save();

    res.json({
      message: "Document uploaded. Waiting for admin approval",
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error); 

    res.status(500).json({
      message: error.message,
    });
  }
};
