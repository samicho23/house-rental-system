/**
 * Results module business logic.
 */
import { resultsRepository as repo } from "./results.repository";

export const resultsService = {
  async publicOverview() {
    const [properties, counts] = await Promise.all([
      repo.publicProperties(),
      repo.publicCounts(),
    ]);

    return {
      properties,
      summary: counts,
    };
  },

  async adminOverview() {
    const records = await repo.adminOverview();
    return {
      ...records,
      summary: {
        properties: records.properties.length,
        applications: records.applications.length,
        contactMessages: records.contactMessages.length,
      },
    };
  },
};
