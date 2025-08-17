import e from "express";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloundinary.js";

const addProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    originalPrice,
    category,
    stockQuantity,
    colorNumber,
    color,
    bestSeller
  } = req.body;

  if (
    !name ||
    !description ||
    !price ||
    !originalPrice ||
    !category ||
    !colorNumber ||
    !color || !bestSeller
  ) {
    res.status(400).json({ message: "Please filled all data" });
  }

  try {
    console.log(req.files);
    const urlImgPath = req.files?.imageUrl[0]?.path || "";
    // console.log(".........", urlImgPath);
    if (!urlImgPath) {
      return res.status(400).json({ message: "Image ie required" });
    }

    const imageUrl = await uploadOnCloudinary(urlImgPath);
  
    const data = await Product.create({
      name,
      description,
      price,
      originalPrice,
      category,
      imageUrl: imageUrl.secure_url,
      stockQuantity,
      colorNumber,
      color : JSON.parse(color),
      bestSeller
    });
    res.status(200).json({ message: "Product successfully saved", data });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Product is not in database", err: error.message });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const productAllData = await Product.find({});
    res
      .status(200)
      .json({ message: "Product successfully loaded...", productAllData });
  } catch (error) {
    res.status(400).json({ message: "Product is not loaded... from Database" });
  }
};

const removeProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const removeProduct = await Product.findByIdAndDelete(productId);
    return res
      .status(200)
      .json({ message: "Product successfully removed...", removeProduct });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Product is not removed... from Database" });
  }
};

const bestSellerProduct = async (req, res) => {
  try {
    const bestSeller = await Product.find({ bestSeller: true });
    return res.status(200).json({
      message: "Bestseller Product Successfully filter from database",
      bestSeller,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Product is not filtered... from Database" });
  }
};

const productDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchProduct = async (req, res) => {
   const { q } = req.query;
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    }).limit(20); // limit for performance
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


 const getCategoriesFromProducts = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.category;
    const products = await Product.find({ category: categoryName });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getAllProduct,
  addProduct,
  removeProduct,
  bestSellerProduct,
  productDetail,
  searchProduct,
  getCategoriesFromProducts,
  getProductsByCategory
};
