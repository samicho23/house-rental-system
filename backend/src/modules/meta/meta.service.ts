/**
 * Meta (public) module business logic - landing page counters.
 */
import { metaRepository as repo } from "./meta.repository";

export const metaService = {
  async publicStats() {
    const [properties, landlords, cities] = await Promise.all([
      repo.countPublishedProperties(),
      repo.countLandlords(),
      repo.findDistinctCities(),
    ]);
    return { properties, landlords, cities: cities.map((c) => c.city) };
  },
};
