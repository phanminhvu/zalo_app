import { defineConfig } from "vite";
// import reactRefresh from "@vitejs/plugin-react-refresh";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [react(),{
      name:"overwrite-config",
      config: ()=> ({
        build: {
          target: "esnext"
        }
      })
    }],
    build: {
      polyfillModulePreload: false,
    },
  });
};