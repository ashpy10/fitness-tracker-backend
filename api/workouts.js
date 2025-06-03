import express from "express";
import {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from "../db/queries/workouts.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
      const workouts = await getAllWorkouts();
      res.json(workouts);
    } catch (err) {
      next(err);
    }
  });

  /**
 * GET /workouts/:id
 * If a workout with that ID exists, return it. Otherwise, 404.
 */
router.get("/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid workout ID" });
      }
  
      const workout = await getWorkoutById(id);
      if (!workout) {
        return res
          .status(404)
          .json({ error: `Workout with ID ${id} not found` });
      }
      res.json(workout);
    } catch (err) {
      next(err);
    }
  });
  
  /**
 * POST /workouts
 * Expect JSON body { date: "YYYY-MM-DD", name: "Some Name" }.
 * If either field is missing, respond 400. Otherwise, insert and respond 201 with the new row.
 */
router.post("/", async (req, res, next) => {
    try {
      const { date, name } = req.body;
      if (!date || !name) {
        return res
          .status(400)
          .json({ error: "Both 'date' and 'name' fields are required" });
      }
  
      const newWorkout = await createWorkout({ date, name });
      res.status(201).json(newWorkout);
    } catch (err) {
      next(err);
    }
  });
  
  /**
 * PUT /workouts/:id
 * Expect JSON body { date: "YYYY-MM-DD", name: "Some Name" }.
 * If ID is invalid or body missing fields, respond 400.
 * If workout not found, respond 404.
 * Otherwise, update and return the updated record.
 */
router.put("/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const { date, name } = req.body;
  
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid workout ID" });
      }
      if (!date || !name) {
        return res
          .status(400)
          .json({ error: "Both 'date' and 'name' fields are required" });
      }
  
      const updated = await updateWorkout(id, { date, name });
      if (!updated) {
        return res
          .status(404)
          .json({ error: `Cannot update: workout with ID ${id} not found` });
      }
      res.json(updated);
    } catch (err) {
      next(err);
    }
  });

  /**
 * DELETE /workouts/:id
 * If ID is invalid, 400. If no such workout, 404. Otherwise delete and return the deleted record.
 */
router.delete("/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid workout ID" });
      }
  
      const deleted = await deleteWorkout(id);
      if (!deleted) {
        return res
          .status(404)
          .json({ error: `Cannot delete: workout with ID ${id} not found` });
      }
      res.json(deleted);
    } catch (err) {
      next(err);
    }
  });
  
  export default router;
