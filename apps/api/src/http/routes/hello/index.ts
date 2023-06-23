import { Router } from "express";
import { hello } from "./handlers";

const routes = async (router: Router) => {
  router.get("/", hello);
};

export default routes;
