const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDb = require("./connectDb.js");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const PORT = process.env.PORT || 2000; // Define PORT

app.use(express.json());
app.use(cors());

// Database connection with mongoose
connectDb(); // Corrected function call

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});

// API creation
app.get("/", (req, res) => {
    res.send("Express App is running");
});

// Image storage engine
const storage = multer.diskStorage({
    destination: "./upload/images", // Corrected destination path
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });
// Creating upload endpoint for image
app.use('/images', express.static('upload/images'));
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    });
});

// Schema for creating products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    }
})
// add product
app.post('/addproduct', async(req,res) => {
    let products = await Product.find({});
    let id;
    if(products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id +1;
    } else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("saved")
    res.json({
        success: true,
        name: req.body.name,
    })
})

//remove product from database
app.post('/removeproduct', async(req, res) => {
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    })
} )

// get all products 
app.get('/allproducts', async(req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Schema user model
const User = mongoose.model('User', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})

//Creating authentication for register the user
app.post('/signup', async(req, res) => {
    let check = await User.findOne({email: req.body.email});
    if(check){
        return res.status(400).json({success: false, errors: "Existing user found with same email address"});
    }
    let cart = {};
    for (let i = 0; i < 300; i++){
        cart[i] = 0;
    }
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
     await user.save();

     const data = {
        user: {
            id: user.id
        }
     }
     const token = jwt.sign(data, 'secret_ecom');
     res.json({success: true, token})
})
// endpoint to user login
app.post('/login', async (req, res)=> {
    let user = await User.findOne({email:req.body.email});
    if(user) {
        const passMatch = req.body.password === user.password;
        if(passMatch){
            const data = {
                user: {
                    id: user.id
            }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({success:true, token});
        } else {
            res.json({success:false, errors:"Wrong Password"});
        }
    } else {
        res.json({success:false, errors:"Wrong Email Address"})
    }
})
//get new collection 

app.get('/newcollections', async(req, res) => {
    let products = await Product.find({});
    let newcollections = products.slice(1).slice(-8);
    console.log("Newcollections Fetched")
    res.send(newcollections);
})

//create end point for popular products
app.get('/popularproducts', async (req, res)=> {
    let products = await Product.find({category: "men"});
    let popularproducts = products.slice(0, 4);
    console.log("popular products fetched");
    res.send(popularproducts);
})



//creating middlwear to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors: "Please authentication using valid login"})
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error){
            res.status(401).send({errors: "Please authenticate using a valid token"});
        }
    }
}
//add to carts all items
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("Added", req.body.itemId)
   let userData = await User.findOne({ _id: req.user.id })
   userData.cartData[req.body.itemId] += 1;
   await User.findOneAndUpdate({ _id:req.user.id }, { cartData: userData.cartData });
   res.send("Added");
})

//remove from cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("Removed", req.body.itemId)
    let userData = await User.findOne({_id: req.user.id})
    if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
await User.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
res.send("Removed");
})

//creating endpoint to get cart data
app.post('/getcart', fetchUser, async(req, res)=> {
    console.log('Get Cart');
    let userData = await User.findOne({ _id: req.user.id});
    res.json(userData.cartData);
})