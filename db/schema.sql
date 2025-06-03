DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS workouts;

CREATE TABLE workouts (
  id   SERIAL PRIMARY KEY,
  date DATE   NOT NULL,
  name TEXT   NOT NULL
);

CREATE TABLE exercises (
  id         SERIAL PRIMARY KEY,
  workout_id INTEGER NOT NULL
             REFERENCES workouts(id)
             ON DELETE CASCADE,
  name       TEXT    NOT NULL,
  sets       INTEGER NOT NULL,
  reps       INTEGER NOT NULL
);
