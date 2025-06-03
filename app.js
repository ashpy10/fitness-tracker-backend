import express from "express";
import workoutsRouter from "./api/workouts.js";
import exercisesRouter from "./api/exercises.js";

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Fitness Tracker API" });
});

// ===== ROUTES =====
app.use("/workouts", workoutsRouter);

app.use("/exercises", exercisesRouter);

// ===== 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error(err); 
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
