// api/exercises.js
import express from "express";
import {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
} from "../db/queries/exercises.js";

const router = express.Router();

/**
 * GET /exercises
 * Respond with an array of all exercise rows.
 */
router.get("/", async (req, res, next) => {
  try {
    const exercises = await getAllExercises();
    res.json(exercises);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /exercises/:id
 * If an exercise with that ID exists, return it. Otherwise, 404.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid exercise ID" });
    }

    const exercise = await getExerciseById(id);
    if (!exercise) {
      return res
        .status(404)
        .json({ error: `Exercise with ID ${id} not found` });
    }
    res.json(exercise);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /exercises
 * Expect JSON body { workout_id: number, name: string, sets: number, reps: number }.
 */
router.post("/", async (req, res, next) => {
  try {
    const { workout_id, name, sets, reps } = req.body;

    if (
      workout_id == null ||
      !name ||
      sets == null ||
      reps == null
    ) {
      return res.status(400).json({
        error:
          "Fields 'workout_id', 'name', 'sets', and 'reps' are all required",
      });
    }
    if (
      isNaN(Number(workout_id)) ||
      isNaN(Number(sets)) ||
      isNaN(Number(reps))
    ) {
      return res
        .status(400)
        .json({ error: "'workout_id', 'sets', and 'reps' must be numbers" });
    }

    const newExercise = await createExercise({
      workout_id: Number(workout_id),
      name,
      sets: Number(sets),
      reps: Number(reps),
    });
    res.status(201).json(newExercise);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /exercises/:id
 * Expect JSON body { workout_id: number, name: string, sets: number, reps: number }.
 */
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { workout_id, name, sets, reps } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid exercise ID" });
    }
    if (
      workout_id == null ||
      !name ||
      sets == null ||
      reps == null
    ) {
      return res.status(400).json({
        error:
          "Fields 'workout_id', 'name', 'sets', and 'reps' are all required",
      });
    }
    if (
      isNaN(Number(workout_id)) ||
      isNaN(Number(sets)) ||
      isNaN(Number(reps))
    ) {
      return res
        .status(400)
        .json({ error: "'workout_id', 'sets', and 'reps' must be numbers" });
    }

    const updated = await updateExercise(id, {
      workout_id: Number(workout_id),
      name,
      sets: Number(sets),
      reps: Number(reps),
    });
    if (!updated) {
      return res
        .status(404)
        .json({ error: `Cannot update: exercise with ID ${id} not found` });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /exercises/:id
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid exercise ID" });
    }

    const deleted = await deleteExercise(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ error: `Cannot delete: exercise with ID ${id} not found` });
    }
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

export default router;
