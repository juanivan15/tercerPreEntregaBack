import ProductModel from "../models/product.model.js";

class ProductManager {

  async addProduct({ title, description, price, thumbnail, code, stock, category }) {
    try {

      if (!title || !description || !price || !category || !code || !stock ) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      const productExists = await ProductModel.findOne({code:code});

      if (productExists) {
        console.log("El código debe ser único");
        return;
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnail || []
      });

      await newProduct.save();

    } catch (error) {
      console.log("Error al guardar producto", error);
      throw error; 
    }
  }
  
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
        const skip = (page - 1) * limit;

        let queryOptions = {};

        if (query) {
            queryOptions = { category: query };
        }

        const sortOptions = {};
        if (sort) {
            if (sort === 'asc' || sort === 'desc') {
                sortOptions.price = sort === 'asc' ? 1 : -1;
            }
        }

        const products = await ProductModel
            .find(queryOptions)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const totalProducts = await ProductModel.countDocuments(queryOptions);

        const totalPages = Math.ceil(totalProducts / limit);
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;

        return {
            docs: products,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
        };
    } catch (error) {
        console.log("Error al obtener los productos", error);
        throw error;
    }
}

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        console.log("Producto no encontrado");
        return null;
      } else {
        console.log("Producto encontrado");
        return product;
      }
    } catch (error) {
      console.log("Error al buscar producto", error);
      throw error;
    }
  }

  async updateProduct(id, updatedProduct) {
    try {

      const updateProduct = await ProductModel.findByIdAndUpdate(id, updatedProduct)  
      if(!updateProduct){
        console.log("Producto no encontrado!");
        return null;
      }

      console.log("Producto actualizado correctamente!");
      return updateProduct;

    } catch (error) {
      console.log("Error al actualizar el producto", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {

        const deleteProduct = await ProductModel.findByIdAndDelete(id);

        if(!deleteProduct){
          console.log("Producto no encontrado!");
          return null;
        }
        
        console.log("Producto eliminado correctamente!");

    } catch (error) {
      console.log("Error al eliminar el producto", error);
      throw error;
    }
  }
}

export default ProductManager;