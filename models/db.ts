import mongoose, { ConnectOptions, Connection } from "mongoose";

const dbUrl = "mongodb+srv://keshav:2uQXZGEIwIDLVYIA@cluster0.wijl0kc.mongodb.net/sales"; 


const options: ConnectOptions = {
  useNewUrlParser: true as any,
  useUnifiedTopology: true as any,
} as any;    

mongoose.connect(dbUrl, options);  

const dbConnection: Connection = mongoose.connection;

dbConnection.once('open', () => {
  console.log("Running on ENV =", process.env.NODE_ENV);
  console.log("Connected to MongoDB.");
});

dbConnection.on('error', (err: Error) => {
  console.error("Unable to connect.");
  console.error(err);
});

export { mongoose, dbConnection, dbUrl };
