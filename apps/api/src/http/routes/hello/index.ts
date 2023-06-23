import { Router } from "express";
import { hello } from "./handlers";

const routes = async (router: Router) => {
  router.post("/", hello);
};

export default routes;
