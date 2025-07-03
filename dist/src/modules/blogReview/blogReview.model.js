"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogReviewModel = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.BlogReviewModel = {
    findByBlogId: (blogId) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.blogReview.findMany({ where: { blogId } });
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.blogReview.findUnique({ where: { id } });
    }),
    create: (data) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.blogReview.create({ data });
    }),
    update: (id, data) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.blogReview.update({ where: { id }, data });
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return prisma.blogReview.delete({ where: { id } });
    }),
};
