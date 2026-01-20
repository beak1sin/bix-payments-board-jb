import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { router } from "./router";
import { Toaster } from "@/components/ui/sonner";
import { GlobalAlertDialog } from "@/components/GlobalAlertDialog";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster richColors position="top-center" />
      <GlobalAlertDialog />
    </ThemeProvider>
  );
}

export default App;
