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
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
