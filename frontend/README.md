This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



export const setPasswordService = async (password: string, token: string) => {
    if (!password || password.length < 6) {
        return { success: false, statusCode: 400, message: "Password must be at least 6 characters" };
    }
    const hashedToken = hashToken(token)
    const user = await User.findOne({
        verificationToken: hashedToken,
        verificationTokenExpiry: {
            $gte: new Date()
        }
    })

    if (!user) {
        return { success: false, statusCode: 400, message: "Invalid or expired token" };
    }

    user.password = await bcrypt.hash(password, 10);
    user.isVerified = true;

    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    user.provider = "local"
    const accessToken = createToken({
        userId: user._id.toString(),
        role: user.role,
        provider: user.provider,
        name: user.name,
        email: user.email,
        ...(user.phoneNumber && {
            phoneNumber: user.phoneNumber
        }),
        tokenSecret: process.env.ACCESS_TOKEN_SECRET!,
        expiry: ACCESS_TOKEN_EXPIRES
    });

    const refreshToken = createToken({
        userId: user._id.toString(),
        role: user.role,
        tokenSecret: process.env.REFRESH_TOKEN_SECRET!,
        expiry: REFRESH_TOKEN_EXPIRES
    })

    user.refreshToken = hashToken(refreshToken)
    user.refreshTokenExpiry = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS) //store the refresh Token expiry in the db
    await user.save();


    return {
        success: true,
        message: "Password set successfully",
        statusCode: 200,
        token: accessToken,
        refreshToken,
        data: { name: user.name, userId: user._id.toString(), phoneNumber: user.phoneNumber, email: user.email, role: user.role }
    };
}   



Settings → Webhooks → Add New Webhook

URL: https://mangoreview.in/api/v1/webhook/razorpay

Secret: your RAZORPAY_WEBHOOK_SECRET from .env

Events to enable:
   payment.captured
   payment.failed
   subscription.charged
   subscription.halted
   subscription.cancelled
   subscription.completed


   https://dashboard.razorpay.com/app/developers/webhooks/SztSMEu1AZBpTo



   https://mangoreview.in/api/v1/webhook/razorpay

