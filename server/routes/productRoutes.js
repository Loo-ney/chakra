import express from "express";
import Product from "../models/Product.js";
import { admin, protectRoute } from "../middleware/authMiddleware.js";
import asyncHandler from "express-async-handler";
import User from '../models/User.js';

const productRoutes = express.Router()

const getProducts= async (req, res) => {
  const page = parseInt(req.params.page) //1., 2 , or 3
  const perPage = parseInt(req.params.perPage) //10

  const products = await Product.find({}); //fetching all data
    
    if(page && perPage) {
      const totalPages = Math.ceil(products.length / perPage);
      const startIndex = (page -1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedProducts = products.slice(startIndex, endIndex);
      res.json({ products: paginatedProducts, pagination: { currentPage: page, totalPages } });
    } else {
      res.json({ products, pagination: {} });
    }
};


// get single products
// public route
const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found.');
    throw new Error('Product not found');
  }
};


// this is protect route
const createProductReview = asyncHandler(async(req, res) => {
  const { rating, comment, userId, title } = req.body;

  const product = await Product.findById(req.params.id);
  const user = await User.findById(userId);

  if (product) {
    const alreadyReviewed = product.reviews.find((review) => review.user.toString() === user._id.toString());

    if (alreadyReviewed) {
      res.status(400).send('Product already reviewed.');
      throw new Error('Product already reviewed.');
    }

    const review = {
      name: user.name,
      rating: Number(rating), 
      comment,
      title,
      user: user._id,
    };

    product.reviews.push(review);

    product.numberOfReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review has been saved.'});
  } else {
    res.status(404).send('Product not found.');
    throw new Error('Product not found.');
  }
})


const createNewProduct = asyncHandler(async (req, res) => {
	const { brand, name, category, stock, price, images, productIsNew, description, subtitle, razorpayId } = req.body;

	const newProduct = await Product.create({
		brand,
		name,
		category,
		subtitle,
		description,
		stock,
		price,
		images,
		productIsNew,
		razorpayId: 0,
	});

	await newProduct.save();

	const products = await Product.find({});

	if (newProduct) {
		res.json(products);
	} else {
		res.status(404).send('Product could not be uploaded.');
		throw new Error('Product could not be uploaded.');
	}
});

const updateProduct = asyncHandler(async (req, res) => {
	const { brand, name, category, stock, price, id, productIsNew, description, subtitle, razorpayId, imageOne, imageTwo } =
		req.body;
	console.log(razorpayId);

	const product = await Product.findById(id);

	if (product) {
		product.name = name;
		product.subtitle = subtitle;
		product.price = price;
		product.description = description;
		product.brand = brand;
		product.category = category;
		product.stock = stock;
		product.productIsNew = productIsNew;
		product.razorpayId = razorpayId;
		product.images = [imageOne, imageTwo];

		await product.save();

		const products = await Product.find({});

		res.json(products);
	} else {
		res.status(404).send('Product not found.');
		throw new Error('Product not found.');
	}
});

const removeProductReview = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.productId);

	const updatedReviews = product.reviews.filter((review) => review._id.valueOf() !== req.params.reviewId);

	if (product) {
		product.reviews = updatedReviews;

		product.numberOfReviews = product.reviews.length;

		if (product.numberOfReviews > 0) {
			product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
		} else {
			product.rating = 5;
		}

		await product.save();
		const products = await Product.find({});
		res.json({ products, pagination: {} });
	} else {
		res.status(404)
		throw new Error('Product not found.');
	}
});

const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findByIdAndDelete(req.params.id);

	if (product) {
		res.json(product);
	} else {
		res.status(404).send('Product not found.');
		throw new Error('Product not found.');
	}
});

productRoutes.route('/:page/:perPage').get(getProducts);
productRoutes.route('/').get(getProducts); // getting all products
productRoutes.route('/:id').get(getProduct); //getting single products -- public route
productRoutes.route('/reviews/:id').post(protectRoute, createProductReview)
productRoutes.route('/').post(protectRoute, admin, createNewProduct);
productRoutes.route('/').put(protectRoute, admin, updateProduct);
productRoutes.route('/:productId/:reviewId').put(protectRoute, admin, removeProductReview);
productRoutes.route('/:id').delete(protectRoute, admin, deleteProduct);

export default productRoutes;