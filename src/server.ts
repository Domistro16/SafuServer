import "dotenv/config";
import express from "express";
import cors from "cors"; // Import cors
import routes from "./router";
const app = express();

app.use(cors());

app.use(express.json());
const port = process.env.PORT || 800;

app.use("/api", routes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
