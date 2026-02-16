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
    alwaysOnTop: config.isDev,
    webPreferences: {
      preload: config.paths.preload,
    },
  });

  if (config.isDev) {
    mainWindow.loadURL("http://localhost:3000");
    app.setAsDefaultProtocolClient("fetch-me-roms", process.execPath, [
      process.argv[1],
    ]);
  } else {
    mainWindow.loadFile(config.paths.ui);
    app.setAsDefaultProtocolClient("fetch-me-roms");
  }

  ipcMainHandle("download", mockStartDownload);
});
