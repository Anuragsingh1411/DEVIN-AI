import mongoose from 'mongoose';


function connect(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    }
    ).catch((err) => {
        console.log(err);
    });
}

export default connect;
