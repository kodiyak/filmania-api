import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { logger } from "@/lib/logger";
import { BrowserHelperService } from "../helpers/browser-helper.service";
import { CacheHelperService } from "../helpers/cache-helper.service";

export class WarezApi {
  private client: AxiosInstance;

  constructor(
    private readonly browserHelperService: BrowserHelperService,
    private readonly cacheHelperService: CacheHelperService
  ) {
    this.client = axios.create({
      headers: {
        "User-Agent": this.browserHelperService.userAgent,
      },
    });
  }

  public async getAllIds() {
    return await Promise.all(
      [
        "https://warezcdn.com/listing.php?type=series",
        "https://warezcdn.com/listing.php?type=movies",
        "https://warezcdn.com/listing.php?type=animes",
      ].map(async (url) => {
        return await this.getIds(url);
      })
    ).then(([series, movies, animes]) => {
      return [...series, ...movies, ...animes];
    });
  }

  public async getIds(url: string): Promise<string[]> {
    const ref = `warez:ids:${url}`;
    const deleteCacheDelay = 1000 * 60 * 60 * 24; // 1 day
    if (await this.cacheHelperService.existsCache(ref)) {
      return JSON.parse(await this.cacheHelperService.readCache(ref)!);
    }

    const html = await this.client.get(url).then((res) => res.data);
    const document = this.browserHelperService.toHTML(html);

    const ids = Array.from(
      document.querySelectorAll("tbody tr > td:first-child") || []
    ).map((el) => {
      return el.innerHTML.trim();
    });

    await this.cacheHelperService.saveCache(ref, JSON.stringify(ids));
    setTimeout(() => {
      this.cacheHelperService.removeCache(ref);
    }, deleteCacheDelay);

    return ids;
  }

  public async getTvInfos(
    type: string,
    warezId: string
  ): Promise<{
    sources: WarezApi.SourceItem[];
    seasons: WarezApi.SeasonItem[];
  }> {
    const ref = `warez:${type}:${warezId}`;
    const deleteCacheDelay = 1000 * 60 * 10; // 10 minutes

    if (await this.cacheHelperService.existsCache(ref)) {
      return JSON.parse(await this.cacheHelperService.readCache(ref)!);
    }

    const html = await this.client
      .get(`https://embed.warezcdn.net/${type}/${warezId}`)
      .then((res) => res.data);

    const result = {
      id: warezId,
      sources: type === "filme" ? await this.getMovieSources(html) : [],
      seasons: type === "serie" ? await this.getSeasons(html) : [],
    };

    await this.cacheHelperService.saveCache(ref, JSON.stringify(result));
    setTimeout(() => {
      this.cacheHelperService.removeCache(ref);
    }, deleteCacheDelay);
    return result;
  }

  private async getSeasons(html: string) {
    const document = this.browserHelperService.toHTML(html);
    const seasonsButtons = Array.from(
      document.querySelectorAll("[data-load-episodes]") || []
    );

    return Promise.all(
      seasonsButtons.map<Promise<WarezApi.SeasonItem>>(async (el) => {
        const id = el.getAttribute("data-load-episodes");
        const season = Number(el.innerHTML.trim());

        return {
          id: Number(id),
          season,
          videos: await this.getSeasonVideos(id),
        };
      })
    );
  }

  private async getSeasonVideos(seasonId: number | string) {
    const formData = new FormData();
    formData.append("getEpisodes", `${seasonId}`);

    return this.client
      .post(
        "https://embed.warezcdn.net/serieAjax.php",
        { getEpisodes: seasonId },
        {
          headers: {
            "content-type": "multipart/form-data",
            referer: "https://embed.warezcdn.net/",
            origin: "https://embed.warezcdn.net/",
          },
        }
      )
      .then((res) => res.data)
      .then(async (v) => {
        return Promise.all(
          Object.values(v.list).map(async (episode: any) => {
            return {
              ...episode,
              sources: await this.getVideoSources(episode.id),
            };
          })
        ) as Promise<WarezApi.VideoItem[]>;
      })
      .catch((err) => {
        logger.error(err);
        return [];
      });
  }

  private async getVideoSources(videoId: number | string) {
    const formData = new FormData();
    formData.append("getAudios", `${videoId}`);

    return this.client
      .post(
        "https://embed.warezcdn.net/serieAjax.php",
        { getAudios: videoId },
        {
          headers: {
            "content-type": "multipart/form-data",
            referer: "https://embed.warezcdn.net/",
            origin: "https://embed.warezcdn.net/",
          },
        }
      )
      .then((res) => res.data)
      .then((config) => {
        return this.configToSources(config);
      })
      .catch((err) => {
        logger.error(err);
        return [];
      });
  }

  private async configToSources(config: any): Promise<WarezApi.SourceItem[]> {
    if (!config?.list) {
      return [];
    }

    return Promise.all(
      Object.values(config.list).map(async (configEmbedItem: any) => {
        const sourceTypes: string[] = [];
        if (configEmbedItem.mixdropStatus === "3") {
          sourceTypes.push("mixdrop");
        }
        if (configEmbedItem.streamtapeStatus === "3") {
          sourceTypes.push("streamtape");
        }

        return await Promise.all(
          sourceTypes.map<Promise<WarezApi.SourceItem>>(async (embedType) => {
            const embedData = await this.getEmbedRedirect(
              `https://warezcdn.com/embed/getPlay.php?id=${configEmbedItem.id}&sv=${embedType}`
            );

            const lang = configEmbedItem.audio === "2" ? "dub" : "leg";

            return {
              lang,
              url: embedData.url,
              subtitleUrl: embedData.subtitle,
              subtitleLang: embedData.lang,
            };
          })
        );
      })
    ).then((sourcesRows) => {
      return sourcesRows.reduce((acc, sources) => [...acc, ...sources], []);
    });
  }

  private async getMovieSources(html: string) {
    const document = this.browserHelperService.toHTML(html);
    const isMultiLang = !!document.querySelector(".selectAudioButton");
    const defaultLangText = !isMultiLang
      ? document.querySelector(".selectAudio b")?.innerHTML?.trim()
      : undefined;
    const defaultLang = defaultLangText
      ? defaultLangText === "Dublado/Português"
        ? "dub"
        : "leg"
      : undefined;

    const getSourceLang = (el: Element, embedId: string) => {
      if (defaultLang) return defaultLang;

      const embedLangText = document
        .querySelector(`.selectAudioButton[data-load-hosts="${embedId}"]`)
        ?.innerHTML?.trim();
      return embedLangText === "DUBLADO" ? "dub" : "leg";
    };

    const sources = await Promise.all(
      Array.from(document.querySelectorAll("[data-load-embed]")).map<
        Promise<WarezApi.SourceItem | undefined>
      >(async (el) => {
        const embedId = el.getAttribute("data-load-embed");
        const embedType = el.getAttribute("data-load-embed-host");
        const lang = getSourceLang(el, embedId!);

        const embedSource = await this.getEmbedRedirect(
          `https://warezcdn.com/embed/getPlay.php?id=${embedId}&sv=${embedType}`
        ).catch(() => undefined);

        if (!embedSource) return undefined;

        return {
          lang,
          url: embedSource.url,
          subtitleLang: embedSource.lang,
          subtitleUrl: embedSource.subtitle,
        };
      })
    ).then((v) => v.filter(Boolean));

    return sources;
  }

  private async getEmbedRedirect(embedUrl: string) {
    return this.getVizerEmbedRedirect(embedUrl, {
      headers: {
        referer: "https://embed.warezcdn.net/",
        origin: "https://embed.warezcdn.net/",
      },
    });
  }

  public async getVizerEmbedRedirect(
    embedUrl: string,
    config?: AxiosRequestConfig
  ) {
    const html = await this.client
      .get<string>(embedUrl, { responseType: "text", ...config })
      .then((res) => res.data)
      .catch((err) => undefined);

    if (!html) throw new Error(`[ERROR_UNDEFINED_HTML] - ${embedUrl} `);

    const data = /window.location.href=\"(.*){1}\"/gm.exec(html);
    if (data && data[1]) {
      const url = new URL(data[1]);

      if (url.host.startsWith("mixdrop")) {
        const subtitle = url.searchParams.get("sub") || undefined;
        return {
          href: url.href,
          url: `${url.origin}${url.pathname}`,
          subtitle,
          lang: subtitle ? "pt-BR" : undefined,
        };
      }

      if (url.host.startsWith("streamtape")) {
        const subtitle = url.searchParams.get("c1_file") || undefined;
        return {
          href: url.href,
          url: `${url.origin}${url.pathname}`,
          subtitle,
          lang: subtitle ? "pt-BR" : undefined,
        };
      }

      throw new Error(`URL ${url.origin} not supported`);
    }

    throw new Error("Cannot get embed by: " + embedUrl);
  }
}

export namespace WarezApi {
  export interface SourceItem {
    url: string;
    lang: string;
    subtitleUrl?: string;
    subtitleLang?: string;
  }

  export interface VideoItem {
    id: string;
    title: string;
    img: string;
    released: boolean;
    seen: boolean;
    name: string;
    sources: SourceItem[];
  }

  export interface SeasonItem {
    id: number;
    season: number;
    videos: VideoItem[];
  }
}
