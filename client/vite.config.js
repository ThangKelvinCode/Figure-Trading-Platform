import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
<<<<<<< HEAD
  server: { port: 5174 },
=======
  server: {
    port: 5174 // change here
  },
>>>>>>> 99b36a28d54bc624eec445cf368163ddd3b43e29
});
