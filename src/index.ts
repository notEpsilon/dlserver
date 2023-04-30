import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { Redis } from "@upstash/redis";

const app = express();

// middlewares
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "*" }));

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

app.get("/api/v1/problems/:owner", async (req: Request, res: Response) => {
  const { owner } = req.params as { owner: string };
  try {
    const data = await redis.get(owner);
    return res.status(200).json({ data, err: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: null, err });
  }
});

app.post("/api/v1/problems/:owner", async (req: Request, res: Response) => {
  const { owner } = req.params as { owner: string };
  const { problems } = req.body as { problems: string };
  try {
    await redis.set(owner, problems);
    return res.status(200).json({ data: "<OK>", err: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: null, err });
  }
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log("listening..."));
