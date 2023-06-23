import axios from "axios";
import { JSDOM } from "jsdom";

export class BrowserHelperService {
  constructor(public readonly userAgent?: string) {}

  public async urlAsDocument(url: string) {
    const { data } = await axios
      .get<string>(url, {
        headers: {
          "User-Agent": this.userAgent,
          "Accept-Encoding": "identity",
        },
        responseType: "text",
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          console.log("PAGE_ERROR_DOCUMENT", {
            url,
            message: err.message,
            status: err.response?.status,
          });
        }
        return { data: "" };
      });
    return this.toHTML(data);
  }

  public toHTML(html: string) {
    const {
      window: { document },
    } = new JSDOM(html);
    return document;
  }
}
