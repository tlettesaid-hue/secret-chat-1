import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "./pages/Index";
import { ChatRoom } from "./components/ChatRoom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/room/:roomCode" element={<ChatRoom />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </>
  );
}

export default App;