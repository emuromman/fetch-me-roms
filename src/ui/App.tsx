import { useEffect } from "react";
import { Button } from "@/components/ui/button";

function App() {
  useEffect(() => {
    const list: DownloadItem[] = [
      { title: "007 James Bond (US)", url: "myrient.us" },
    ];
    window.core.download(list).then((data) => console.log(data));
  }, []);

  return (
    <>
      <div className="flex min-h-svh w-full flex-col items-center justify-center">
        <Button variant="default">Click me</Button>
      </div>
    </>
  );
}

export default App;
