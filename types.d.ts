type Insight = "CPU" | "RAM" | "STORAGE";

type UnsubscribeFunction = () => void;

type DownloadResponse = {
  success: true;
  data?: unknow;
  error?: string;
};
type DownloadItem = {
  title: string;
  url: string;
};

type IpcEvents = {
  changeInsight: {
    args: [Insight];
    return: Insight;
  };
  download: {
    args: [DownloadItem[]];
    return: DownloadResponse;
  };
};

// Extend base window object type
interface Window {
  core: {
    download: (downloadList: DownloadItem[]) => Promise<DownloadResponse>;
    subscribeInsightChange: (
      callback: (insight: Insight) => void,
    ) => UnsubscribeFunction;
  };
}
