import { z } from "zod";

export const formSchema = z.object({
  make: z.string().trim().min(1, {
    message: "Make is required",
  }),
  model: z.string().trim().min(1, {
    message: "model is required",
  }),
  color: z.string().trim().min(1, {
    message: "color is required",
  }),
  year: z.number().min(1930).max(2050),
  mileage: z.number().min(0).max(1_000_000),
  imageUrl: z.string().trim().min(1, {
    message: "color is required",
  }),
  reservePrice: z.number().min(0).optional().or(z.literal(0)),
  auctionEnd: z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;
