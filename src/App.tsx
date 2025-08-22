import { BrowserRouter } from "react-router-dom"; // ✅ đúng
import { App as AntApp, ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainRoutes from "./app/routes/MainRoutes/MainRoutes";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
  });

  return (
    <BrowserRouter>
      <AntApp component={false}>
        <ConfigProvider
          tag={{ className: "text-[14px] font-semibold py-1 px-2" }}
          theme={{
            token: {
              fontFamily: "Bai Jamjuree",
              colorLink: "#02cf5b",
              borderRadius: 4,
            },
          }}
        >
          <QueryClientProvider client={queryClient}>
            <MainRoutes /> {/* ✅ tất cả routes (kể cả /map) sẽ ở đây */}
          </QueryClientProvider>
        </ConfigProvider>
      </AntApp>
    </BrowserRouter>
  );
}

export default App;