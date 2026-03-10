import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Taekwondo API", version: "1.0.0" },
    components: {
      securitySchemes: {
        BearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64abc123def456" },
            clerkUserId: { type: "string", example: "user_2abc123" },
            displayName: { type: "string", example: "John Doe" },
            level: { type: "integer", minimum: 1, maximum: 5, example: 1 },
            goals: {
              type: "array",
              items: { type: "string" },
              example: ["flexibility"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CloudinaryVideo: {
          type: "object",
          properties: {
            url: { type: "string", example: "https://res.cloudinary.com/..." },
            publicId: { type: "string", example: "taekwondo/kick_front" },
            durationSec: { type: "number", example: 30 },
            format: { type: "string", example: "mp4" },
            bytes: { type: "number", example: 2048000 },
            thumbnailUrl: {
              type: "string",
              example: "https://res.cloudinary.com/.../thumb.jpg",
            },
          },
        },
        Exercise: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64abc123def456" },
            name: { type: "string", example: "Front Kick" },
            slug: { type: "string", example: "front-kick" },
            category: {
              type: "string",
              enum: ["mobility", "flexibility", "strength"],
              example: "flexibility",
            },
            level: { type: "integer", minimum: 1, maximum: 5, example: 2 },
            focus: {
              type: "array",
              items: { type: "string" },
              example: ["hip", "quad"],
            },
            equipment: {
              type: "array",
              items: { type: "string" },
              example: ["none"],
            },
            durationSecDefault: { type: "integer", example: 45 },
            instructions: {
              type: "array",
              items: { type: "string" },
              example: ["Stand upright", "Raise knee"],
            },
            commonMistakes: {
              type: "array",
              items: { type: "string" },
              example: ["Bent standing leg"],
            },
            safetyNotes: {
              type: "array",
              items: { type: "string" },
              example: ["Warm up first"],
            },
            video: { $ref: "#/components/schemas/CloudinaryVideo" },
            isPublished: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        PlaylistItem: {
          type: "object",
          properties: {
            exerciseId: { type: "string", example: "64abc123def456" },
            order: { type: "integer", minimum: 1, example: 1 },
          },
        },
        Playlist: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64abc123def456" },
            clerkUserId: { type: "string", example: "user_2abc123" },
            name: { type: "string", example: "Morning Warm-up" },
            description: { type: "string", example: "Stretching routine" },
            isPublic: { type: "boolean", example: false },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/PlaylistItem" },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        SessionItem: {
          type: "object",
          properties: {
            exerciseId: { type: "string", example: "64abc123def456" },
            completed: { type: "boolean", example: true },
            repsDone: { type: "integer", minimum: 0, example: 10 },
            workSecDone: { type: "integer", minimum: 0, example: 45 },
            rpe: { type: "integer", minimum: 1, maximum: 10, example: 7 },
            pain: {
              type: "object",
              properties: {
                hip: { type: "integer", minimum: 0, maximum: 10, example: 2 },
                knee: { type: "integer", minimum: 0, maximum: 10, example: 0 },
                lowerBack: {
                  type: "integer",
                  minimum: 0,
                  maximum: 10,
                  example: 1,
                },
              },
            },
          },
        },
        Session: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64abc123def456" },
            clerkUserId: { type: "string", example: "user_2abc123" },
            performedAt: { type: "string", format: "date-time" },
            durationSec: { type: "integer", minimum: 0, example: 1800 },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/SessionItem" },
            },
            notes: { type: "string", example: "Felt great today" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
