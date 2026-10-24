/**
 * News module data access (Prisma).
 */
import { prisma } from "../../lib/prisma";
import type { NewsArticleInput, UpdateNewsArticleInput } from "./news.validations";

const publicSelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  content: true,
  coverImageUrl: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, firstName: true, lastName: true } },
} as const;

export const newsRepository = {
  listPublished() {
    return prisma.newsArticle.findMany({
      where: { status: "PUBLISHED" },
      select: publicSelect,
      orderBy: { publishedAt: "desc" },
    });
  },

  findPublishedBySlug(slug: string) {
    return prisma.newsArticle.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: publicSelect,
    });
  },

  listAll() {
    return prisma.newsArticle.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  },

  create(input: NewsArticleInput, authorId: string) {
    return prisma.newsArticle.create({
      data: {
        ...input,
        authorId,
        publishedAt: input.status === "PUBLISHED" ? new Date() : null,
      },
    });
  },

  update(id: string, input: UpdateNewsArticleInput) {
    return prisma.newsArticle.update({
      where: { id },
      data: {
        ...input,
        publishedAt:
          input.status === "PUBLISHED"
            ? new Date()
            : input.status === "DRAFT"
              ? null
              : undefined,
      },
    });
  },

  remove(id: string) {
    return prisma.newsArticle.delete({ where: { id } });
  },
};
