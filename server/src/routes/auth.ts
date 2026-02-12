import { Router } from "express";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { email, passwordHash, subscriptionId: 1 },
  });

  res.status(201).json({ id: newUser.id, email: newUser.email });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const foundUser = await prisma.user.findUnique({ where: { email } });
  if (!foundUser) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, foundUser.passwordHash);

  if (!passwordMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign(
    { userId: foundUser.id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "24h",
    },
  );

  res.status(200).json({ token: token });
});

export default router;
