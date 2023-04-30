import express from "express";
import cors from "cors";
import { Redis } from "@upstash/redis";

const app = express();

// middlewares
app.use(cors({ origin: process.env.FRONT_URL }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

app.get("/api/v1/problems/:owner", async (req, res) => {
  const { owner } = req.params;
  try {
    const data = await redis.get(owner);
    return res.status(200).json({ data, err: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ data: null, err });
  }
});

app.post("/api/v1/problems/:owner", async (req, res) => {
  const { owner } = req.params;
  const { problems } = req.body;
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
