import db from "../client.js";

/**
 * Get all exercises, ordered by ID ascending.
 * Returns an array of rows, each row = { id, workout_id, name, sets, reps }.
 */
export async function getAllExercises() {
    const result = await db.query(
      `
      SELECT *
      FROM exercises
      ORDER BY id;
      `
    );
    return result.rows;
  }
  
  /**
 * Get a single exercise by its ID.
 * @param {number} id – the exercise’s ID.
 * Returns a row object or `undefined` if not found.
 */
export async function getExerciseById(id) {
    const result = await db.query(
      `
      SELECT *
      FROM exercises
      WHERE id = $1;
      `,
      [id]
    );
    return result.rows[0];
  }
  
  /**
 * Create a new exercise tied to a workout.
 * @param {{ workout_id: number, name: string, sets: number, reps: number }} exerciseData
 * Returns the newly inserted row.
 */
export async function createExercise(exerciseData) {
    const result = await db.query(
      `
      INSERT INTO exercises (workout_id, name, sets, reps)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [exerciseData.workout_id, exerciseData.name, exerciseData.sets, exerciseData.reps]
    );
    return result.rows[0];
  }
  
  /**
 * Update an exercise by ID.
 * @param {number} id – which exercise to update.
 * @param {{ workout_id?: number, name?: string, sets?: number, reps?: number }} changes
 *   – fields to change. We’ll assume all fields are provided for simplicity.
 * Returns the updated row or `null` if no row was updated.
 */
export async function updateExercise(id, changes) {
    const result = await db.query(
      `
      UPDATE exercises
      SET workout_id = $1,
          name       = $2,
          sets       = $3,
          reps       = $4
      WHERE id = $5
      RETURNING *;
      `,
      [changes.workout_id, changes.name, changes.sets, changes.reps, id]
    );
    return result.rows[0] || null;
  }
  
  /**
 * Delete an exercise by its ID.
 * @param {number} id – which exercise to delete.
 * Returns the deleted row, or `null` if it didn’t exist.
 */
export async function deleteExercise(id) {
    const result = await db.query(
      `
      DELETE FROM exercises
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );
    return result.rows[0] || null;
  }
  