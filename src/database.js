//Conexion con MongoDB
import mongoose from "mongoose";

mongoose.connect("mongodb+srv://juanivangonz15:mongodbcoder@cluster0.e2dhfiu.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0")
.then(()=> console.log("Conexión a la base de datos exitosa"))
.catch(()=>console.log("Error al conectar con la base de datos"))