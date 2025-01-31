import app from "./app.js";
import { createAdminUser } from "./libs/createUser.js";
import "./database.js";
import { PORT } from "./config.js";

async function main() {
  await createAdminUser();

  // Iniciar el servidor y guardar la instancia
  const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });

  // Manejador de errores del servidor
  server.on("error", (error) => {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT;

    // Manejar errores específicos con mensajes descriptivos
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
}



main();
