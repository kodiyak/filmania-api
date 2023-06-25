import { Router } from "express";
import { loadEpisodeImage, loadShowImage } from "./handlers";

const routes = async (router: Router) => {
  router.get("/:type/:slug/:imageType.webp", loadShowImage);
  router.get(
    "/:type/:slug/seasons/:seasonNumber/episodes/:episodeNumber/thumbnail.webp",
    loadEpisodeImage
  );
};

export default routes;
