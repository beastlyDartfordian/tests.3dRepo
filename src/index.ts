import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen({ port: Number(PORT) }, (err) => {
    if (err) {
      console.error("Server failed to start:", err);
      process.exit(1);
    }
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
