import axios from "axios";
import { Collection } from "collect.js";

type ShowType = "tv" | "movie";

export class TmdbApi {
  private apiKey = "b72a253cec61fb7595e9254414583e27";

  public client = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    params: {
      api_key: "b72a253cec61fb7595e9254414583e27",
    },
  });

  public async search(
    type: ShowType | "multi",
    query: string,
    language = "pt-BR",
    params?: any
  ): Promise<any[]> {
    const nextParams = { query, language, api_key: this.apiKey, ...params };

    return this.client
      .get(`https://api.themoviedb.org/3/search/${type}`, {
        params: nextParams,
      })
      .then((res) => res.data)
      .then((data) => {
        return data?.results || [];
      });
  }

  public async getExternalIds(type: ShowType, showId: string | number) {
    return this.client
      .get(`https://api.themoviedb.org/3/${type}/${showId}/external_ids`)
      .then((res) => res.data);
  }

  public async findShow(
    type: ShowType,
    movieId: string | number,
    language = "en-US"
  ) {
    return this.client
      .get(`/${type}/${movieId}`, {
        params: {
          language,
          append_to_response: "videos,images,credits,seasons,keywords",
        },
      })
      .then((res) => res.data);
  }

  public async findSeason(
    tvId: string | number,
    seasonNumber: number,
    language = "pt-BR"
  ) {
    return this.client
      .get(`/tv/${tvId}/season/${seasonNumber}`, {
        params: {
          language,
        },
      })
      .then((res) => res.data);
  }

  public async find(query: string, params?: any) {
    return this.client
      .get(`/find/${query}`, {
        params: { language: "pt-BR", ...params },
      })
      .then((res) => res.data);
  }

  public async;

  public async getImagesUrls(
    showType: ShowType,
    tmdbId: string,
    props: {
      covers: string[];
      posters: string[];
      logos: string[];
    }
  ) {
    const imagesEn = await this.getImages(showType, tmdbId, "pt,en,null");
    const imagesPt = await this.getImages(showType, tmdbId, "pt");

    const withImage = this.withImage;

    function getUrls(name: string) {
      const nextUrls: string[] = [
        ...(imagesPt[name] || []),
        ...(imagesEn[name] || []),
      ].map((v: any) => {
        return withImage(v.file_path, "original");
      });
      return nextUrls;
    }

    const covers = new Collection([
      ...getUrls("backdrops"),
      ...(props.covers || []),
    ])
      .unique()
      .toArray();
    const posters = new Collection([
      ...getUrls("posters"),
      ...(props.posters || []),
    ])
      .unique()
      .toArray();
    const logos = new Collection([...getUrls("logos"), ...(props.logos || [])])
      .unique()
      .toArray();

    return { covers, posters, logos };
  }

  public async findByImdb(imdbId: string) {
    const tmdbShow = await this.find(imdbId, { external_source: "imdb_id" })
      .then((res) => {
        return [...res.movie_results, ...res.tv_results];
      })
      .then((results) => {
        return results?.[0];
      });

    if (!tmdbShow) {
      throw new Error(`Cannot found TMDB Show data by id [${imdbId}]`);
    }
    return tmdbShow;
  }

  public async getPerson(personId: string | number) {
    return this.client
      .get(`/person/${personId}`, {
        params: { language: "pt-BR" },
      })
      .then((res) => res.data);
  }

  public withImage(path: string, w = "original") {
    return `https://image.tmdb.org/t/p/${w}${path}`;
  }

  public async getImages(type: ShowType, showId: string, language = "en") {
    return this.client
      .get(`/${type}/${showId}/images`, {
        params: {
          ...(language.indexOf(",") > -1
            ? { include_image_language: `${language}` }
            : { language }),
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return {};
      });
  }
}
