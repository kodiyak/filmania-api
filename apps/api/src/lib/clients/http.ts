import axios from "axios";

export const httpRobot = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    Referer: "https://www.google.com/",
    Origin: "https://www.google.com/",
  },
});
