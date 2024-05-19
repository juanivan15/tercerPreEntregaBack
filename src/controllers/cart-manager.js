import CartModel from "../models/cart.model.js";

class CartManager {

    async createCart() {
        try {
            const newCart = new CartModel({products:[]});
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error al crear el carrito");
            throw error;
        }
    }

    async getCarts() {
        try {
          const carts = await CartModel.find();
          return carts;
        } catch (error) {
          console.log("Error al leer la base de datos", error);
          throw error;
        }
    }

    async getProductsByCartId(cid) {
        try {
          const cart = await CartModel.findById(cid)
          if (!cart) {
            throw new Error(`Cart with Id: ${cid} not found`)
          }
          return cart.products
        } catch (error) {
          throw error
        }
      }
    
    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }
            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await CartModel.findById(cartId);
            
            let productIndex = cart.products.findIndex(item => item.product.toString() === productId);
    
            if (productIndex !== -1) {
                // Si el producto ya está en el carrito, actualiza la cantidad
                cart.products[productIndex].quantity += quantity;
            } else {
                // Si el producto no está en el carrito, se lo añáde
                cart.products.push({ product: productId, quantity });
            }
    
            // Marca la propiedad "products" como modificada antes de guardar.
            cart.markModified("products");
    
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar un producto al carrito", error);
            throw error;
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito ', error);
            throw error;
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = updatedProducts;

            // Marco la propiedad "products" como modificada antes de guardar.
            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito en el gestor', error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;

                // Marco la propiedad "products" como modificada antes de guardar.
                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito', error);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito en el gestor', error);
            throw error;
        }
    }


}

export default CartManager;