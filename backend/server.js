import express from "express";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("works");
});
// app.use("/api/auth",authRoutes);

// app.get("/*",(req:Request,res:Response)=>{
//     res.send("works");
// });
app.listen(3000, () => {
  console.log("running on ");
});
