import { ipcMain, WebContents, WebFrameMain } from "electron";
import { pathToFileURL } from "url";

import path from "path";
import { app } from "electron";

export function getPreloadPath() {
  const root = process.env.NODE_ENV === "development" ? "." : "..";
  return path.join(app.getAppPath(), root, "dist-electron/preload.cjs");
}

export function getUIPath() {
  return path.join(app.getAppPath(), "/dist-react/index.html");
}

export function getAssetPath() {
  const root = process.env.NODE_ENV === "development" ? "." : "..";
  return path.join(app.getAppPath(), root, "/src/assets");
}

// Helper function to make registering of event handlers type safe
// Change IpcEvents as api grows (used for responding to
// an event triggered by the frontend)
export function ipcMainHandle<K extends keyof IpcEvents>(
  key: K,
  handler: (...args: IpcEvents[K]["args"]) => IpcEvents[K]["return"],
) {
  ipcMain.handle(key, (event, ...args: unknown[]) => {
    validateEventFrame(event.senderFrame);
    return handler(...(args as IpcEvents[K]["args"]));
  });
}

// Helper function to make registering of send to frontend handlers type safe
// Change IpcEvents as api grows (used in pollResources
// for getting sys statistics, sends data to fronend without
// invocation, the frontend will subscribe)
export function ipcWebContentsSend<K extends keyof IpcEvents>(
  key: K,
  webContents: WebContents,
  payload: IpcEvents[K]["return"],
  ...args: IpcEvents[K]["args"]
) {
  webContents.send(key, payload, ...(args as IpcEvents[K]["args"]));
}

// Middleware to ensure invocations to core is from our UI
export function validateEventFrame(frame: WebFrameMain | null) {
  if (!frame) {
    console.log("Frame is null in validateEventFrame");
    return;
  }
  if (
    process.env.NODE_ENV === "development" &&
    new URL(frame.url).host === "localhost:3000"
  ) {
    return;
  }

  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error("Malicious event");
  }
}
