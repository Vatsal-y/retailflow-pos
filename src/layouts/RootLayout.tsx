import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "react-hot-toast";

export function RootLayout({ children }: { children?: React.ReactNode }) {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-background">
        {children || <Outlet />}
        <Toaster position="top-right" />
      </div>
    </Provider>
  );
}
