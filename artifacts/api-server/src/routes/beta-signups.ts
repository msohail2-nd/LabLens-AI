import { Router, type IRouter } from "express";
import { CreateBetaSignupBody, CreateBetaSignupResponse } from "@workspace/api-zod";
import { betaSignupsTable, db } from "@workspace/db";

const router: IRouter = Router();

router.post("/beta-signups", async (req, res): Promise<void> => {
  const parsed = CreateBetaSignupBody.safeParse(req.body);

  if (!parsed.success) {
    req.log.warn({ issues: parsed.error.issues }, "Invalid beta signup");
    res.status(400).json({ error: "Please check the form and try again." });
    return;
  }

  const signup = {
    ...parsed.data,
    name: parsed.data.name.trim(),
    email: parsed.data.email.trim().toLowerCase(),
    researchField: parsed.data.researchField.trim(),
    graduateProgram: parsed.data.graduateProgram.trim(),
    biggestChallenge: parsed.data.biggestChallenge.trim(),
  };

  const [created] = await db
    .insert(betaSignupsTable)
    .values(signup)
    .onConflictDoNothing({ target: betaSignupsTable.email })
    .returning({ id: betaSignupsTable.id });

  if (!created) {
    res.status(409).json({
      error: "This email is already on the LabLens AI beta waitlist.",
    });
    return;
  }

  req.log.info({ signupId: created.id }, "Beta signup accepted");
  res.status(201).json(
    CreateBetaSignupResponse.parse({
      accepted: true,
      message:
        "You're on the LabLens AI beta list. We'll be in touch as the beta takes shape.",
    }),
  );
});

export default router;