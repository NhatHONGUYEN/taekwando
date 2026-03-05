import "dotenv/config";
import mongoose from "mongoose";
import Exercise from "../models/Exercise.js";
import connectDB from "../config/db.js";

const exerciseNamesAndSlugs = [
  ["Hip Opener Flow", "hip-opener-flow"],
  ["Shoulder Mobility", "shoulder-mobility"],
  ["Squat Jump", "squat-jump"],
  ["Front Kick Drill", "front-kick-drill"],
  ["Plank Hold", "plank-hold"],
  ["Side Kick Combo", "side-kick-combo"],
  ["Push Up", "push-up"],
  ["Roundhouse Kick", "roundhouse-kick"],
  ["Lunge Stretch", "lunge-stretch"],
  ["Back Kick", "back-kick"],
  ["Mountain Climbers", "mountain-climbers"],
  ["Arm Circles", "arm-circles"],
  ["Burpees", "burpees"],
  ["Core Twist", "core-twist"],
  ["High Knees", "high-knees"],
  ["Hamstring Stretch", "hamstring-stretch"],
  ["Elbow Strike", "elbow-strike"],
  ["Calf Raise", "calf-raise"],
  ["Punch Combo", "punch-combo"],
  ["Balance Drill", "balance-drill"],
];

const exercises = exerciseNamesAndSlugs.map(([name, slug], i) => ({
  name,
  slug,
  category: i % 2 === 0 ? "mobility" : "strength",
  level: (i % 3) + 1,
  focus: [i % 2 === 0 ? "hips" : "shoulders"],
  equipment: [i % 4 === 0 ? "band" : "none"],
  durationSecDefault: 30 + i * 5,
  instructions: [
    "Respire lentement",
    "Garde le dos neutre",
    `Conseil spécifique ${name}`,
  ],
  safetyNotes: ["Arrête si douleur vive"],
  isPublished: true,
  video: {
    url: `https://res.cloudinary.com/xxx/video/upload/v123/${slug}.mp4`,
    publicId: slug,
    durationSec: 30 + i,
    format: "mp4",
    bytes: 1000000 + i * 10000,
    thumbnailUrl: `https://res.cloudinary.com/xxx/image/upload/v123/${slug}.jpg`,
  },
}));

const run = async () => {
  await connectDB();
  console.log(connectDB);
  // idempotent: upsert par slug
  for (const ex of exercises) {
    await Exercise.updateOne({ slug: ex.slug }, { $set: ex }, { upsert: true });
  }

  console.log("✅ Exercises seeded");
  await mongoose.disconnect();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
