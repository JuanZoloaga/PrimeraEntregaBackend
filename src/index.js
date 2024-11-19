import express from 'express';
import {uid} from "uid"

const app= express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}))


//chequeo si el servidor está funcionando
app.get('/ping', (req, res)=>{
    res.send('pong')
})

let productos = []
let carrito = []

//obtener todos los productos
app.get('/api/products',(req,res)=>{
    res.send(productos)
})

//buscar un producto en específico y mostrarlo en respuesta
app.get('/api/products/:pid',(req,res)=>{
    let prodId = req.params.pid
    const busquedaProd = productos.find((producto) => producto.id === prodId )
    res.send(busquedaProd)
})

//agregar un producto a la base
app.post('/api/products',(req,res)=>{
    
    let producto = req.body
    producto.id= uid();
    productos.push(producto)

    res.send(`producto creado y su id es ${producto.id}`);
})


//modificar producto de la base
app.put('/api/products/:pid',(req,res)=>{
    let prodId = req.params.pid
    const busquedaProd = productos.find((producto) => producto.id === prodId )
    if(busquedaProd){
        let productoAct = req.body
        busquedaProd.title = productoAct.title
        busquedaProd.descripcion = productoAct.descripcion
        busquedaProd.code = productoAct.code
        busquedaProd.status = productoAct.status
        busquedaProd.stock = productoAct.stock
        busquedaProd.category = productoAct.category
        busquedaProd.thumbnails = productoAct.thumbnails
        busquedaProd.price = productoAct.price
        res.send("Producto actualizado")
    }else{
    res.send("no hay ningun producto en la base de datos con ese ID")
    }

})


//borrar producto de la base
app.delete('/api/products/:pid',(req,res)=>{
    let prodId = req.params.pid
    const busquedaProd = productos.filter((producto) => producto.id !== prodId )
    productos = busquedaProd
    res.send("Producto eliminado")
})




//configuración del carrito
//crear carrito y agregar productos
app.post('/api/carts',(req,res)=>{
    let nuevoCarrito = {}
    nuevoCarrito.idCarrito= uid();
    nuevoCarrito.productos = req.body
    carrito.push(nuevoCarrito)
    res.send(`carrito creado con éxito`);
    console.log(carrito)
})

//buscar id de carrito y mostrar sus productos
app.get('/api/carts/:cid',(req,res)=>{
    let carritoId = req.params.cid
    const busquedaCarr = carrito.find((cart) => cart.idCarrito === carritoId )
    if (busquedaCarr) {
        res.send(busquedaCarr.productos);
    } else {
        res.send("no existe un carrito con ese ID");
    }

})

//modificar producto de carrito creado
app.post('/api/carts/:cid/product/:pid',(req,res)=>{
    let carritoId = req.params.cid
    let productoId = req.params.pid
    let productoAgregado = req.body

    const busquedaDeCarr = carrito.find((cart) => cart.idCarrito === carritoId )

    if(busquedaDeCarr){
        const busquedaProd = busquedaDeCarr.productos.some((producto) => producto.id === productoId)
        if (busquedaProd) {
            const actProductos = busquedaDeCarr.productos.map(productos =>{
                if(productos.id === productoId ){
                    productos.quantity = productoAgregado.quantity
                    return productos
                }else{
                    return productos
                }
            })
            busquedaDeCarr.productos=actProductos
        } else {
            busquedaDeCarr.productos.push(productoAgregado)
        }
        res.send(busquedaDeCarr)
    }else{
        res.send("no existe un carrito con ese ID");
    }

})




//mantener el server abierto
app.listen(PORT, ()=>{
    console.log(`servidor funcionando en el puerto ${PORT}`)
})