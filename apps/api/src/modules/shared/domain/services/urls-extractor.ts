import { WebUrl } from "../url";

export interface UrlsExtractor {
  extract(uri: string): Promise<WebUrl[]>;
}
