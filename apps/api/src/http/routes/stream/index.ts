import { Router } from "express";
import { loadEpisodeImage, loadShowImage } from "./handlers";

const routes = async (router: Router) => {
  router.get("/:slug/:imageType.webp", loadShowImage);
  router.get(
    "/:slug/seasons/:seasonNumber/episodes/:episodeNumber/thumbnail.webp",
    loadEpisodeImage
  );
};

export default routes;
