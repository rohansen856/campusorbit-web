import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { z } from "zod"

import { currentUser } from "@/lib/authentication"
import { db } from "@/lib/db"
import { studentVerificationSchema } from "@/lib/validation"

import { emailBody } from "./email-body"

export async function POST(req: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: "Signup and login first to register" },
        { status: 403 }
      )
    }
    const body = await req.json()
    // Parse and validate the request body
    const parseResult = studentVerificationSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid college email" },
        { status: 400 }
      )
    }

    const { collegeEmail, idCardImage, portraitImage, holdingIdImage } =
      parseResult.data

    const studentData = await db.student.findFirst({
      where: { user_id: user.id },
      select: { institute: { select: { id: true } } },
    })

    if (!studentData) {
      return NextResponse.json(
        { error: "Signup and login first to register" },
        { status: 403 }
      )
    }

    const institute = await db.institute.findFirst({
      where: {
        id: studentData.institute.id,
        mail_slug: collegeEmail.split("@")[1],
      },
      select: {
        id: true,
        short_name: true,
        name: true,
      },
    })

    if (!institute) {
      return NextResponse.json(
        {
          error:
            "College mail does not match with your student data. Change it to correct option in the settings",
        },
        { status: 400 }
      )
    }

    const { id } = await db.studentVerification.create({
      data: {
        userId: user.id,
        collegeEmail,
        idCardImage,
        portraitImage,
        holdingIdImage,
      },
    })
    // Configure the Nodemailer transport with Gmail and Google App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your Google App Password
      },
    })

    // Define the email options
    const mailOptions: nodemailer.SendMailOptions = {
      from: process.env.GMAIL_USER, // Sender address
      to: "rohansen856@gmail.com", //collegeEmail, // Recipient email
      subject: "Student verification @campusorbit", // Email subject
      html: emailBody(id),
    }

    // Send the email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: "Email sent" }, { status: 200 })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Error sending email" }, { status: 500 })
  }
}
