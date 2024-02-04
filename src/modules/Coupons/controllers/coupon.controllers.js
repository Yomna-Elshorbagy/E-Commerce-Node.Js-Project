import couponModel from "../../../../db/models/Coupon.model.js";
import userModel from "../../../../db/models/user.model.js";

export const Createcoupon = async (req, res) => {
  try {
    const { couponCode, value } = req.body;
    const expireInDays = parseInt(req.body.expireInDays) || 7;

    const existingCoupon = await couponModel.findOne({ couponCode });
    if (existingCoupon) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }
    const expireIn = new Date();
    // expireIn.setDate(expireIn.getDate() + 7);
    expireIn.setDate(expireIn.getDate() + expireInDays);

    // Get the user ID from the authenticated user
    const createdBy = req.userid;

    const newCoupon = new couponModel({
      couponCode,
      value,
      createdBy,
      expireIn,
    });

    const savedCoupon = await newCoupon.save();

    res.json(savedCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change expiration-date when Deleted by admin
export const deletedBy = async (req, res) => {
  try {
    const couponId = req.params.id;

    // Assuming you have authentication middleware to get the admin user ID
    const deletedBy = req.userid;

    const expireIn = new Date(); // Set to current date to mark it as expired

    const updatedCoupon = await couponModel.findByIdAndUpdate(
      couponId,

      { expireIn, deletedBy },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Coupones expired by id
export const getAllCoupons = async (req, res) => {
  try {
    const allCoupons = await couponModel.find();
    res.json(allCoupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update coupon Data :
// export const updatedCoupon = async (req, res) => {
//   try {
//     const couponId = req.params.id;
//     const { couponCode, value, expireIn } = req.body;

//     if (!couponCode || typeof couponCode !== "string") {
//       return res.status(400).json({ message: "Invalid coupon code" });
//     }

//     if (isNaN(value) || value <= 0) {
//       return res.status(400).json({ message: "Invalid coupon value" });
//     }

//     const updatedCoupon = await couponModel.findByIdAndUpdate(
//       couponId,
//       { couponCode, value, expireIn },
//       { new: true }
//     );

//     if (!updatedCoupon) {
//       return res.status(404).json({ message: "Coupon not found" });
//     }

//     res.json(updatedCoupon);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const updatedCoupon = async (req, res) => {
    try {
      const couponId = req.params.id;
      const { couponCode, value, autoUpdateExpireIn } = req.body;
      // If autoUpdateExpireIn is true, calculate the new expiration date
      if (autoUpdateExpireIn){
        var newExpireIn = new Date();
        newExpireIn.setDate(newExpireIn.getDate() + 7);
      }  
      const coupon = await couponModel.findById(couponId);
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
      // Validation conditions
      if (!couponCode || typeof couponCode !== 'string') {
        return res.status(400).json({ message: 'Invalid coupon code' });
      }
  
      if (isNaN(value) || value <= 0) {
        return res.status(400).json({ message: 'Invalid coupon value' });
      }
 
      // Proceed with the update
      const updatedCoupon = await couponModel.findByIdAndUpdate(
        couponId,
        { couponCode, value, expireIn: newExpireIn },
        { new: true }
      );
  
      if (!updatedCoupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      res.json(updatedCoupon);
        } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  export const updateCouponByname = async (req, res) => {
    const user = await userModel.findById(req.userid);
    const { couponCode, value, expiresIn } = req.body;
    const coupon = await couponModel.findOne({ couponCode });
    if (!coupon) return res.send({ message: " cant find coupon" });
    if (user._id.equals(coupon.createdBy) || user.role == "admin") {
      await couponModel.findOneAndUpdate(
        { couponCode },
        {
          couponCode,
          value,
          expiresIn,
        }
      );
      const updatedCoupon = await couponModel.findOne({ couponCode });
      return res.send({ message: "updated", coupon: updatedCoupon });
    } else {
      return res.send({ message: "can't update coupon" });
    }
  };
