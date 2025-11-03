import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import React from "react";
import BoardView from "@/components/pages/BoardView";
import BoardList from "@/components/pages/BoardList";
import Layout from "@/components/organisms/Layout";

function App() {
return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-body">
        <Routes>
<Route path="/" element={<Layout />}>
            <Route index element={<BoardList />} />
<Route path="boards" element={<BoardList />} />
            <Route path="recent" element={<BoardList />} />
            <Route path="favorites" element={<BoardList />} />
            <Route path="board/:boardId" element={<BoardView />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
/>
      </div>
    </BrowserRouter>
  );
}

export default App;