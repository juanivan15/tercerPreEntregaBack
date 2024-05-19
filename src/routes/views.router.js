import express from "express";
const router = express.Router();
import ProductManager from"../controllers/product-manager.js";
import CartManager from "../controllers/cart-manager.js";
const productManager = new ProductManager();
const cartManager = new CartManager();
import CartModel from "../models/cart.model.js";


router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 4 } = req.query;
    const products = await productManager.getProducts({
      page: parseInt(page),
      limit: parseInt(limit)
    });

    const arrayProducts = products.docs.map(product => {
      const { _id, ...rest } = product.toObject();
      return rest;
   });


    res.render("home", {
      products: arrayProducts,
      titulo: "Mis productos",
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      currentPage: products.page,
      totalPages: products.totalPages
    });
    
  } catch (error) {
    console.log("No se pudo obtener los productos", error);
    res.status(500).json({error: "Error interno del servidor"});   
  }
})

router.get("/register", (req, res) => {
  if(req.session.login) {
      return res.redirect("/profile");
  }
  res.render("register");
})

router.get("/login", (req, res) => {
  res.render("login");
})

router.get("/profile", (req, res) => {
  if(!req.session.login){
      return res.redirect("/login");
  }
  res.render("profile", {user: req.session.user})
})


export default router;