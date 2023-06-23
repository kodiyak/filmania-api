import axios, { AxiosInstance } from "axios";
import { BrowserHelperService } from "../helpers/browser-helper.service";

export class InfrazApi {
  private client: AxiosInstance;

  constructor(private readonly browserHelperService: BrowserHelperService) {
    this.client = axios.create({
      baseURL: "http://web.infraz.top",
      params: {
        username: "2623964775",
        password: "urqv72r",
        avatar_id: "1682829307",
      },
      headers: {
        "user-agent": this.browserHelperService.userAgent,
        referer: "http://web.infraz.top",
        host: "web.infraz.top",
        cookie: "PHPSESSID=snbseomaps83itonjqt23jthi2",
      },
    });
  }

  public async getMovies() {
    return this.client
      .get(`/player_api.php`, {
        params: {
          action: "get_vod_streams",
          search: "",
        },
      })
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        const result = JSON.parse(res.callFunction.handleVods) as any[];
        return result;
      });
  }

  public async getSeries() {
    return this.client
      .get(`/player_api.php`, {
        params: {
          action: "get_series",
          search: "",
        },
      })
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        const result = JSON.parse(res.callFunction.handleSeries) as any[];
        return result;
      });
  }

  public async getSerie(serieId: string) {
    return this.client
      .get(`/player_api.php`, {
        params: {
          action: "get_series_info",
          series_id: serieId,
        },
      })
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        const result = JSON.parse(res.callFunction.handleSerieInfo) as any;
        return result;
      });
  }

  public async getMovie(movieId: string | number) {
    // http://web.infraz.top/player_api.php?username=2623964775&password=urqv72r&action=get_vod_info&vod_id=324152&avatar_id=1682829307
    return this.client
      .get(`/player_api.php`, {
        params: {
          action: "get_vod_info",
          vod_id: movieId,
        },
      })
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        const result = JSON.parse(res.callFunction.handleVodInfo);

        return result as any;
      });
  }
}
