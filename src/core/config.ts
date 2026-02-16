import path from "path";
import { app } from "electron";

type Paths = {
  preload: string;
  ui: string;
  assets: string;
};

type Config = {
  paths: Paths;
  isDev: boolean;
};

const isDev = process.env.NODE_ENV === "development";
export const config: Config = {
  paths: {
    preload: getPreloadPath(),
    ui: getUIPath(),
    assets: getAssetPath(),
  },
  isDev,
};

function getPreloadPath() {
  const root = isDev ? "." : "..";
  return path.join(app.getAppPath(), root, "dist-electron/preload.cjs");
}

function getUIPath() {
  return path.join(app.getAppPath(), "/dist-react/index.html");
}

function getAssetPath() {
  const root = isDev ? "." : "..";
  return path.join(app.getAppPath(), root, "/src/assets");
}
