"use server";

import { z } from "zod";
import { insertReviewSchema } from "../validators";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

// Create and Update Reviews
export async function createOrUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth();
    if (!session) throw new Error("User not authenticated!");

    // Validate and store the review
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user?.id,
    });

    // Get product to be reviewed
    const product = await prisma.product.findFirst({
      where: { id: review.productId },
    });

    if (!product) throw new Error("Product not found!");

    // Check if user has already reviewed
    const reviewExists = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (reviewExists) {
        // Update the review
        await tx.review.update({
          where: { id: reviewExists.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        // Create the review
        await tx.review.create({
          data: review,
        });
      }

      //   Get average rating
      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      // Get number of reviews
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      // Update rating and numReviews in Product Table
      await tx.product.update({
        where: { id: review.productId },
        data: { rating: averageRating._avg.rating || 0, numReviews },
      });
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Review added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get All Reviews for a product
export async function getReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { data };
}

// Get a review written by the current user
export async function getReviewByProductId({
  productId,
}: {
  productId: string;
}) {
  const session = await auth();
  if (!session) throw new Error("User not authenticated!");

  return await prisma.review.findFirst({
    where: {
      productId,
      userId: session?.user?.id,
    },
  });
}
