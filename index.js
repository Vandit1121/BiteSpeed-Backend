import express from "express";
import bodyParser from "body-parser";
import identifyRoutes from "./routes/identifyRoutes.js";
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/identify",identifyRoutes);

const PORT  = process.env.PORT || 4001;

app.listen(PORT,() => {
    console.log(`server is running on ${PORT}...`);
})
 