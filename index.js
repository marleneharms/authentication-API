const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
//import routes 
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//connect to db
mongoose.connect(process.env.DB_CONNECT, () => 
    console.log('connected to db! yaaay')
);

//middlewares
app.use(express.json());
app.use(cors());

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

const PORT = process.env.PORT || 4000

// puerto donde se hará deploy y conexiones de donde va a aceptar conexiones
app.listen(PORT, "0.0.0.0", () => console.log('Server up and running')); // escuchando el puerto 

