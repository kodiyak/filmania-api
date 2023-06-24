import { envConfig } from "@/configs/env";

export class ApplicationService {
  public withApiUrl(url: string) {
    return envConfig.apiUrl + url;
  }
}
