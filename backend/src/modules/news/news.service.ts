/**
 * News module business logic.
 */
import { AppError } from "../../errors/AppError";
import { newsRepository as repo } from "./news.repository";
import type { NewsArticleInput, UpdateNewsArticleInput } from "./news.validations";

export const newsService = {
  listPublished() {
    return repo.listPublished();
  },

  async getPublished(slug: string) {
    const article = await repo.findPublishedBySlug(slug);
    if (!article) throw new AppError("News article not found", 404);
    return article;
  },

  listAll() {
    return repo.listAll();
  },

  create(input: NewsArticleInput, authorId: string) {
    return repo.create(input, authorId);
  },

  update(id: string, input: UpdateNewsArticleInput) {
    return repo.update(id, input);
  },

  remove(id: string) {
    return repo.remove(id);
  },
};
