import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { makeExtractCompanyCnpjRocks } from "@/modules/scrapper-services";
import { ExtractCompanyCnpjRocksCommand } from "@/modules/scrapper-services/commands/extract-company-cnpj-rocks.command";
import { makeFetchSitemap } from "@/modules/sync-services";
import { FetchSitemapCommand } from "@/modules/sync-services/commands/fetch-sitemap.command";
import { Core } from "@packages/core";

const fetchSitemap = makeFetchSitemap();
const fetchCompany = makeExtractCompanyCnpjRocks();

const reloadSitemaps = async () => {
  try {
    const sitemapData = await db.externalServiceUrl.findFirstOrThrow({
      orderBy: {
        updatedAt: "asc",
      },
      where: {
        type: Core.UrlType.Sitemap,
      },
    });

    await fetchSitemap.fetch(
      new FetchSitemapCommand({
        urlId: sitemapData.id,
      })
    );

    const data = await db.externalServiceUrl.findUniqueOrThrow({
      where: { id: sitemapData.id },
    });

    logger.info(`URL Fetched: ${data.url}`);
  } catch (error) {
    logger.error(`Error reloading sitemaps: ${error.message}`);
  }
};

const reloadPages = async () => {
  try {
    const pageUrl = await db.externalServiceUrl.findFirstOrThrow({
      orderBy: {
        updatedAt: "asc",
      },
      where: {
        type: Core.UrlType.Page,
      },
    });

    const result = await fetchCompany.extract(
      new ExtractCompanyCnpjRocksCommand({
        urlId: pageUrl.id,
      })
    );

    if (result.company) {
      logger.info(`Company Fetched: ${result.company.cnpj}`);
    }
  } catch (error) {
    logger.error(`Error reloading pages: ${error.message}`);
  }
};

export default async function run() {
  setInterval(async () => {
    await Promise.allSettled([reloadSitemaps, reloadPages]);
  }, 1000 * 3);
}
