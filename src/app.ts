import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import connectDatabase from "./config/database";
import eventRoutes from "./routes/event";
import ticketRoutes from "./routes/ticket";

const app = Fastify();

connectDatabase();

app.register(swagger, {
    openapi: {
      info: {
        title: "API Docs",
        description: "Fastify API with Swagger",
        version: "1.0.0",
      },
    },
});
  
app.register(swaggerUi, {
  routePrefix: "/",
});

app.register(eventRoutes);
app.register(ticketRoutes);

export default app;
