import { contextBridge, ipcRenderer } from "electron";

// Helper function for making frontend typesafe
function ipcInvoke<K extends keyof IpcEvents>(
  key: K,
  ...args: IpcEvents[K]["args"]
): Promise<IpcEvents[K]["return"]> {
  return ipcRenderer.invoke(key, ...(args as IpcEvents[K]["args"]));
}

// Helper function for making frontend typesafe
function ipcOn<Key extends keyof IpcEvents>(
  key: Key,
  callback: (payload: IpcEvents[Key]["return"]) => void,
) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload);

  ipcRenderer.on(key, cb);

  return () => ipcRenderer.off(key, cb);
}

// Functions to be exposed to the fronend, aim to keep this limited
const coreApi = {
  download: (downloadList: DownloadItem[]) =>
    ipcInvoke("download", downloadList),
  subscribeInsightChange: (callback) => {
    return ipcOn("changeInsight", callback);
  },
} satisfies Window["core"];

// Append our api to the window object as window.electron
contextBridge.exposeInMainWorld("core", coreApi);
