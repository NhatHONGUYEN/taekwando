import "dotenv/config";
import { createRequire } from "module";
import Exercise from "../models/Exercise.js";
import connectDB from "../config/db.js";

const require = createRequire(import.meta.url);
const exercises = require("../data/exercises.json");

const seed = async () => {
  await connectDB();

  await Exercise.deleteMany();
  await Exercise.insertMany(exercises);

  console.log(`✅ ${exercises.length} exercises seeded`);
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
