import { QueryClientProvider } from "react-query";
import { queryClient } from "./lib/clients/queryClient";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Button } from "@chakra-ui/react";
import ThemeProvider from "./components/providers/ThemeProvider";

const App: React.FC = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Button>Hello World</Button>
        </ThemeProvider>
      </QueryClientProvider>
      <Toaster />
    </>
  );
};

export default App;
