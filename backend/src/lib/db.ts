import mongoose from "mongoose";

const DATABASE_NAME = "eCommerce_db";
const DATABASE_URL = process.env.DATABASE_URL;

/* When you want to deploy the database make sure to change
 the DATABASE_URL to the actual URL of the database
*/
export const connectDB = () => {
  mongoose
    .connect(`${DATABASE_URL}${DATABASE_NAME}`)
    .then(() => {
      console.log("Connected to", DATABASE_NAME, "database");
    })
    .catch((error) => {
      console.log("Error connecting to the database", error.message);
      process.exit(1);
    });
};
