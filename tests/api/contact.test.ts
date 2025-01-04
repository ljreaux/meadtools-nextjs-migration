import { POST } from "@/app/api/contact/route";
import nodemailer from "nodemailer";
import { createRequest } from "node-mocks-http";

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  }),
}));

const sendMailMock = nodemailer.createTransport().sendMail as jest.Mock;

describe("/api/contact", () => {
  beforeAll(() => {
    process.env.EMAIL_USER = "contact@meadtools.com";
    process.env.EMAIL_PASS = "testpassword";
  });

  it("should return 400 if required fields are missing", async () => {
    const req = createRequest({
      method: "POST",
      body: { user_name: "John", user_email: "john@example.com" }, // Missing message
    });
    req.json = async () => req.body;

    const res = await POST(req as any);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "All fields are required" });
  });

  it("should send an email successfully", async () => {
    sendMailMock.mockResolvedValueOnce({});

    const req = createRequest({
      method: "POST",
      body: {
        user_name: "John",
        user_email: "john@example.com",
        message: "Hello, this is a test message.",
      },
    });
    req.json = async () => req.body;

    const res = await POST(req as any);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Email sent successfully" });
    expect(sendMailMock).toHaveBeenCalledWith({
      from: `"Contact Form" <contact@meadtools.com>`,
      to: "contact@meadtools.com",
      subject: "New message from John",
      text: expect.stringContaining("You have a new message"),
    });
  });

  it("should return 500 if email sending fails", async () => {
    sendMailMock.mockRejectedValueOnce(new Error("SMTP Error"));

    const req = createRequest({
      method: "POST",
      body: {
        user_name: "John",
        user_email: "john@example.com",
        message: "Hello, this is a test message.",
      },
    });
    req.json = async () => req.body;

    const res = await POST(req as any);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ message: "Failed to send email" });
    expect(sendMailMock).toHaveBeenCalled();
  });
});
