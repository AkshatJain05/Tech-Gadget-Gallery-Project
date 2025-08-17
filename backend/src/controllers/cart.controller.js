import { User } from "../models/user.model.js";

const getAllCart = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      console.log("/////// req.user:", req.user);
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(req.user._id)
      .populate({
        path: "cartItem.productId",
        select: "name price imageUrl",
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addTOCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(userId);

    const existingItem = user.cartItem.find((item) =>
      item.productId.equals(productId)
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItem.push({ productId, quantity });
    }

    const usercart = await user.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cart: usercart,
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update cart", error: err.message });
  }
};

const removeCart = async (req, res) => {
  const userId = req.user.id;

  const { productId } = req.body;

  try {
    const user = await User.findById(userId);

    const existingItem = user.cartItem.find((item) =>
      item.productId.equals(productId)
    );
    if (existingItem) {
      user.cartItem.pull(existingItem);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      cart: user.cart,
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update cart", error: err.message });
  }
};

const mergeCart = async (req, res) => {
  try {
    const { localCart } = req.body; // [{ productId, quantity }]
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Convert existing cart to a Map for easy merging
    const cartMap = new Map();
    user.cartItem.forEach((item) => {
      cartMap.set(item.productId.toString(), item.quantity);
    });

    // Merge localCart into server cart
    localCart.forEach((item) => {
      const pid = item.productId.toString();
      if (cartMap.has(pid)) {
        cartMap.set(pid, cartMap.get(pid) + item.quantity); // add quantity
      } else {
        cartMap.set(pid, item.quantity);
      }
    });

    // Update user cart
    user.cartItem = Array.from(cartMap).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

    await user.save();

    res.json({ success: true, cart: user.cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error merging cart" });
  }
};

export { addTOCart, removeCart, getAllCart, mergeCart };
