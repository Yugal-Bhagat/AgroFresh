import User from "../models/User.js";

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