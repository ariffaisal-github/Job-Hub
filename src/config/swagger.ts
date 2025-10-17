import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "JobHub API Documentation",
      version: "1.0.0",
      description: `
      🚀 **JobHub Backend API**

      A full-featured hiring platform connecting job seekers and employers.

      **Features include:**
      - User sign-up with OTP verification
      - JWT-based authentication & role system
      - Profile management
      - Job posting and applications
      - Payment integration (Stripe)
      - Messaging, Interview Scheduling, Admin Controls

      _Built with Express, TypeScript, Prisma, PostgreSQL, and Redis._
      `,
      contact: {
        name: "Arif Faisal",
        email: "ariffaisal18.19@gmail.com",
      },
    },
    servers: [
      {
        url: "https://job-hub-v5zz.onrender.com",
        description: "Production server",
      },
      {
        url: "http://localhost:4000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"], // Path to route files
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
