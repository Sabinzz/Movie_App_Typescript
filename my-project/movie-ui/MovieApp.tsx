"use client";

import { ToastContainer } from "react-toastify";
import MovieContext from "./Context/MovieContext";
import BossPage from "./Main/BossPage";

export default function MovieApp() {
  return (
    <MovieContext>
      <BossPage />
      <ToastContainer theme="dark" />
    </MovieContext>
  );
}
