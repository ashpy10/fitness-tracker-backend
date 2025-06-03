import db from "../client.js";

export async function getAllWorkouts() {
    const result = await db.query(
      `
      SELECT *
      FROM workouts
      ORDER BY id;
      `
    );
    return result.rows;
  }

  /**
 * Get a single workout by its ID.
 * @param {number} id – the workout’s ID.
 * Returns a row object or `undefined` if not found.
 */
export async function getWorkoutById(id) {
    const result = await db.query(
      `
      SELECT *
      FROM workouts
      WHERE id = $1;
      `,
      [id]
    );
    return result.rows[0]; // either the object or undefined
  }
  
  /**
 * Create a new workout.
 * @param {{ date: string, name: string }} workoutData – an object with date & name.
 * Returns the newly inserted row (including its new `id`).
 */
export async function createWorkout(workoutData) {
    const result = await db.query(
      `
      INSERT INTO workouts (date, name)
      VALUES ($1, $2)
      RETURNING *;
      `,
      [workoutData.date, workoutData.name]
    );
    return result.rows[0];
  }

  /**
 * Update a workout by ID.
 * @param {number} id – which workout to update.
 * @param {{ date?: string, name?: string }} changes – fields to change.
 * Returns the updated row, or `null` if no row was updated.
 */
export async function updateWorkout(id, changes) {
    // We’ll update both date and name, assuming the client always sends both.
    const result = await db.query(
      `
      UPDATE workouts
      SET date = $1,
          name = $2
      WHERE id = $3
      RETURNING *;
      `,
      [changes.date, changes.name, id]
    );
    return result.rows[0] || null;
  }
  
  /**
 * Delete a workout by its ID.
 * @param {number} id – which workout to delete.
 * Returns the deleted row, or `null` if it didn’t exist.
 */
export async function deleteWorkout(id) {
    const result = await db.query(
      `
      DELETE FROM workouts
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );
    return result.rows[0] || null;
  }
  