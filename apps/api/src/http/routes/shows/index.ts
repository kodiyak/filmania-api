import { makeLoadShowsHttpController } from "@/modules/shows";
import { Router } from "express";

const routes = async (router: Router) => {
  router.get("/", makeLoadShowsHttpController().load);
};

export default routes;
