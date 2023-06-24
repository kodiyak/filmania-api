import {
  makeLoadShowSeasonsHttpController,
  makeLoadShowSourcesHttpController,
  makeLoadShowsHttpController,
  makeViewShowHttpController,
} from "@/modules/shows";
import { Router } from "express";

const routes = async (router: Router) => {
  router.get("/", makeLoadShowsHttpController().load);
  router.get("/:slug", makeViewShowHttpController().view);
  router.get("/:slug/sources", makeLoadShowSourcesHttpController().load);
  router.get(
    "/:slug/seasons/:season/episodes/:episode",
    makeLoadShowSourcesHttpController().load
  );
  router.get(`/:slug/seasons`, makeLoadShowSeasonsHttpController().load);
};

export default routes;
