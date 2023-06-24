import {
  makeLoadShowsHttpController,
  makeViewShowHttpController,
} from "@/modules/shows";
import { Router } from "express";

const routes = async (router: Router) => {
  router.get("/", makeLoadShowsHttpController().load);
  router.get("/:slug", makeViewShowHttpController().view);
};

export default routes;
