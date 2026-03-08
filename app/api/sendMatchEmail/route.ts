import { Resend } from "resend"

export async function POST(req: Request) {

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY missing - skipping email.");
      return Response.json({ success: false, error: "Missing API Key" });
    }

    const resend = new Resend(apiKey)

    const { email, matchName, matchEmail, matchPhone } = await req.json()

    console.log("Sending email to:", email)

    const response = await resend.emails.send({
      from: "UBC Dating <onboarding@resend.dev>",
      to: email,
      subject: "❤️ You Got Matched!",
      html: `
        <h2>You have a new match!</h2>

        <p>You were matched with <b>${matchName}</b>.</p>

        <p>Email: ${matchEmail}</p>
        <p>Phone: ${matchPhone}</p>

        <p>Good luck ❤️</p>
      `
    })

    console.log("Resend response:", response)

    return Response.json({ success: true })

  } catch (error) {

    console.error("Email error:", error)

    return Response.json({ error })

  }

}