import { app, BrowserWindow } from "electron";
import { config } from "./config.js";
import { ipcMainHandle } from "./utils.js";

function mockStartDownload(downloadList: DownloadItem[]): DownloadResponse {
  return {
    success: true,
    data: downloadList,
  };
}

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: config.paths.preload,
    },
  });

  if (config.isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(config.paths.ui);
  }

  ipcMainHandle("download", mockStartDownload);
});
