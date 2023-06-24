import { onRequestErrorHandle } from "@/http/errors/onRequestError";
import { db } from "@/lib/db";
import { makeTmdbApi } from "@/modules/shared";
import { Request, Response } from "express";

const getShowImages = async ({
  tmdbId,
  typeImage,
  showType,
}: {
  showType: string;
  tmdbId: string;
  typeImage: string;
  imageIndex?: number;
}) => {
  const tmdbType = showType === "movie" ? "movie" : "tv";
  const tmdb = makeTmdbApi();

  const images = await tmdb.client
    .get(`/${tmdbType}/${tmdbId}/images`, {
      params: {
        include_image_language: "pt,en",
      },
    })
    .then((res) => {
      return (
        res.data[typeImage]?.map((poster) =>
          tmdb.withImage(
            poster.file_path,
            typeImage === "posters" ? "w500" : "original"
          )
        ) || []
      );
    });

  return images;
};

const getEpisodeImages = async ({
  tmdbId,
  episodeNumber,
  seasonNumber,
}: {
  tmdbId: string;
  seasonNumber: number;
  episodeNumber: number;
}) => {
  const tmdb = makeTmdbApi();
  const images = await tmdb.client
    .get(`/tv/${tmdbId}/season/${seasonNumber}/episode/${episodeNumber}/images`)
    .then((res) => res.data)
    .then((res) => {
      return (
        res.stills?.map((still) => tmdb.withImage(still.file_path, "w400")) ||
        []
      );
    });

  return images;
};

export async function loadShowImage(req: Request, res: Response) {
  const { slug, imageType = "posters" } = req.params;
  const { i: imageIndex = "0", t: showType } = req.query;
  const { tmdbId, type, cover } = await db.show.findFirstOrThrow({
    where: {
      slug,
      type: showType as string,
    },
    select: {
      tmdbId: true,
      type: true,
      cover: true,
    },
  });

  const images = await getShowImages({
    showType: type,
    tmdbId,
    typeImage: imageType,
  });
  const image = images[Number(imageIndex)] ?? images[0] ?? cover;

  try {
    res.redirect(image);
  } catch (error) {
    return onRequestErrorHandle(req, res, error);
  }
}

export async function loadEpisodeImage(req: Request, res: Response) {
  const { slug, episodeNumber, seasonNumber } = req.params;
  const { i: imageIndex = "0" } = req.query;
  const { tmdbId } = await db.show.findFirstOrThrow({
    where: {
      slug,
      type: {
        in: ["serie", "anime"],
      },
    },
    select: {
      tmdbId: true,
    },
  });

  const images = await getEpisodeImages({
    tmdbId,
    episodeNumber: Number(episodeNumber),
    seasonNumber: Number(seasonNumber),
  });
  const image = images[Number(imageIndex)] ?? images[0];

  try {
    res.redirect(image);
  } catch (error) {
    return onRequestErrorHandle(req, res, error);
  }
}
