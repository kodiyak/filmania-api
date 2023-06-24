import { envConfig } from "@/configs/env";

export class ApplicationService {
  public withApiUrl(url: string) {
    return envConfig.apiUrl + url;
  }

  public withStreamUrl(url: string) {
    return `${envConfig.apiUrl}/api/stream${url}`;
  }
}
