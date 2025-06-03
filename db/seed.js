
import db from "./client.js";

async function seed() {
  try {
    await db.query("DELETE FROM exercises;");
    await db.query("DELETE FROM workouts;");

    const workoutsData = [
      { date: "2025-05-20", name: "Leg Day" },
      { date: "2025-05-21", name: "Upper Body Blast" },
      { date: "2025-05-22", name: "Yoga & Core" },
      { date: "2025-05-23", name: "HIIT Cardio" },
      { date: "2025-05-24", name: "Full Body Strength" },
    ];

    const workoutIds = []; 
    for (let w of workoutsData) {
      const {
        rows: [insertedWorkout],
      } = await db.query(
        `
        INSERT INTO workouts (date, name)
        VALUES ($1, $2)
        RETURNING *;
      `,
        [w.date, w.name]
      );
      workoutIds.push(insertedWorkout.id);
    }
    console.log(`Inserted ${workoutIds.length} workouts.`);

    const exercisesData = [
      { workout_id: workoutIds[0], name: "Squats", sets: 3, reps: 12 },
      { workout_id: workoutIds[0], name: "Lunges", sets: 3, reps: 10 },
      { workout_id: workoutIds[1], name: "Push-Ups", sets: 4, reps: 15 },
      { workout_id: workoutIds[1], name: "Bicep Curls", sets: 3, reps: 12 },
      { workout_id: workoutIds[2], name: "Plank", sets: 3, reps: 60 },
      { workout_id: workoutIds[2], name: "Boat Pose", sets: 2, reps: 45 },
      { workout_id: workoutIds[3], name: "Burpees", sets: 3, reps: 10 },
      { workout_id: workoutIds[3], name: "Mountain Climbers", sets: 3, reps: 20 },
      { workout_id: workoutIds[4], name: "Deadlifts", sets: 3, reps: 8 },
      { workout_id: workoutIds[4], name: "Overhead Press", sets: 3, reps: 10 },
    ];

    for (let e of exercisesData) {
      await db.query(
        `
        INSERT INTO exercises (workout_id, name, sets, reps)
        VALUES ($1, $2, $3, $4);
      `,
        [e.workout_id, e.name, e.sets, e.reps]
      );
    }
    console.log(`Inserted ${exercisesData.length} exercises.`);

    await db.end();
    console.log("Done seeding. Database connection closed.");
  } catch (error) {
    console.error("Error during seed:", error);
    await db.end();
    process.exit(1);
  }
}
seed();
