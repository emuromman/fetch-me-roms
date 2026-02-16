import { useEffect } from "react";
import Dashboard from "./Dashboard";

function App() {
  useEffect(() => {
    const list: DownloadItem[] = [
      { title: "007 James Bond (US)", url: "myrient.us" },
    ];
    window.core.download(list).then((data) => console.log(data));
  }, []);

  return <Dashboard />;
}

export default App;
