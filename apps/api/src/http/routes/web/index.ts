import { makeLoadAllPathsHttpController } from "@/modules/web";
import { Router } from "express";

const routes = async (router: Router) => {
  router.get("/paths", makeLoadAllPathsHttpController().load);
};

export default routes;
