import User from "../models/User.js";
import SellerVerification from "../models/SellerVerification.js";

export const getPendingFarmers = async (req, res) => {
  const farmers = await User.find({
    userType: "farmer",
    "verification.status": "pending",
  });

  res.json(farmers);
};

export const verifyFarmer = async (req, res) => {
  try {
    const { status } = req.body; // approved / rejected

    const user = await User.findById(req.params.userId);

    user.verification.status = status;
    user.verification.verifiedAt = new Date();

    await user.save();

    res.json({
      message: `Farmer ${status}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Verification failed",
    });
  }
};

// Get pending seller verification applications
export const getPendingSellerVerifications = async (req, res) => {
  try {
    const applications = await SellerVerification.find({
      status: "pending",
    }).populate("farmer", "fullName email mobile address");

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};

// Approve or reject seller verification
export const processSellerVerification = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, adminNotes, rejectionReason } = req.body;

    const application = await SellerVerification.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    application.adminNotes = adminNotes;

    if (status === "rejected") {
      application.rejectionReason = rejectionReason;
    } else if (status === "approved") {
      application.verificationDate = new Date();

      // Update user to enable selling
      await User.findByIdAndUpdate(application.farmer, {
        isSellingEnabled: true,
      });
    }

    await application.save();

    res.json({
      message: `Seller verification ${status}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Verification processing failed",
    });
  }
};
