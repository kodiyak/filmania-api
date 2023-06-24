import { Router } from "express";
import { hello } from "./handlers";

const routes = async (router: Router) => {
  router.get("/:type/:imdbId", hello);
};

export default routes;
