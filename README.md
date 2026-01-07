This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
<<<<<<< HEAD
=======
# next.js
>>>>>>> 9f7322267dc4f0f5eeff189603527f07cbc0ff55



























📜 Project Requirement: Advanced Analytics & Customer CRM Module

Project Name: Viking Armory Blades - Admin Intelligence SystemGoal: Ek aisa system banana jo sirf data store na kare, balki har User/Customer ki puri history (360-Degree View) provide kare aur saare data (Orders, Reviews, Inquiries) ko Email ke zariye link kare.

1. Core Concept (Main Logic)

System 2 levels par kaam karega:



Global Analytics (Summary Page): Puri website ka haal (Kitne log aaye, kahan se aaye, total sales).

Individual CRM (Customer Insight): Jab kisi specific Order/Inquiry ko khola jaye, to us bande ki puri purani history (Past Orders, Total Spent, Reviews) wahi dikh jaye.

2. Technical Features Breakdown

Module A: Intelligent Tracking System (The Spy)

User jab website par aaye, toh bina login kiye uska data track hona chahiye.



Unique Visitor ID: LocalStorage me ek unique ID save hogi.

Traffic Source (Referrer): User kahan se aaya? (Google, Facebook, Instagram, Direct).

Geo-Location: IP Address se Country aur City detect karna (Use geoip-lite or ipapi).

Device Info: User Mobile par hai ya Desktop par (Added Feature).

Session Data: Usne site par kitne page view kiye aur kitne clicks kiye.

Module B: The "Linked" Database (The CRM)

Har Database Schema (Order, Inquiry, Review) mein common field "Email" aur "MetaData" hoga.



Logic: Jab bhi Admin kisi Order ko khole, system background mein check karega:



"Kya is Email (ali@gmail.com) ne pehle koi Order kiya hai? Koi Inquiry bheji hai? Koi Review diya hai?"

3. UI/UX Requirements (Admin Dashboard)

Page 1: Analytics Summary Dashboard

Ye page 4 filters ke saath aayega: Daily | Weekly | Monthly | Yearly.

Data Points to Show:



Traffic Stats:

Total Visitors & Total Clicks.

Top Countries/Cities: (e.g., Pakistan: 80%, USA: 20% | Lahore: 50 Users).

Traffic Sources: (Google: 40%, Direct: 30%, Social: 30%).

Device Split: (Mobile vs Desktop) - Zaroori hai design fix karne ke liye.

Sales Intelligence:

Total Revenue & Total Orders.

Payment Split: COD vs Stripe (Card) percentage.

Engagement:

Total New Inquiries.

Total New Reviews.

Page 2: Order/Inquiry Details (The "Linked" View)

Ye sabse important UI change hai. Jab Admin Single Order Page par jaye:



Left Side: Order ki normal details (Product, Address, Status).

Right Side (Customer Profile Card): Ek sundar sa panel/box jo customer ki kundali dikhaye:

Name & Location: (e.g., Ali from Lahore, Pakistan).

Source: Ye banda Google Search se aaya tha.

Customer Lifetime Value: Isne aaj tak total kitne paise kharch kiye hain.

History Tabs (Clickable):

🔴 Past Orders (3): Click karne par choti list khule (Date + Amount).

🟡 Inquiries (1): Click karne par uska purana message dikh jaye.

🟢 Reviews (2): Click karne par dikhe ki isne kis product ko kya rating di thi.

Action Button: "View Full Profile" (Optional).

4. Technical Implementation Steps for Programmer

Step 1: Frontend Tracking (Next.js/React)

useEffect hook create karna hai jo App load hote hi run ho:



Check localStorage for visitorID.

Capture document.referrer (Source).

Capture Device Type (navigator.userAgent).

In sabko state/context mein hold karna taaki jab Order place ho to ye data saath jaye.

Step 2: Backend API & Middleware

IP Detection: request.headers['x-forwarded-for'] se IP nikalna.

Geo-Coding: IP ko City/Country me convert karna (Third-party API integration).

CRM Endpoint: Ek nayi API banana /api/customer-history jo email receive kare aur Orders + Inquiries + Reviews collections ko query karke combined result bheje.

Step 3: Database Schema Updates (Mongoose)

Programmer ko ye fields add karne hain:

Order Schema:



JavaScript



{

  customerEmail: String,

  paymentMethod: { type: String, enum: ['COD', 'Stripe'] },

  metaData: {

    source: String,       // e.g. "Google"

    ip: String,

    country: String,

    city: String,

    device: String,       // e.g. "Mobile"

    landingPage: String   // Kis page par pehli baar aaya tha

  }

}

Inquiry & Review Schemas:

Same metaData fields yahan bhi add honge taaki pata chale feedback dene wala kahan se aaya tha.

5. Summary of Deliverables (Iska Result kya milega)

Admin ko pata chalega ki marketing kahan karni hai (agar Lahore se zyada log hain to Lahore me ad chalao).

Fake Orders pakadna aasaan hoga (agar IP Russia ki hai aur Address Pakistan ka hai -> Fraud Alert).

Customer Service better hogi (Admin ko pehle se pata hoga ki ye purana customer hai, isne pehle bhi shikayat ki thi).

Programmer Note:



"Please ensure data fetching for 'Customer History' is done asynchronously (Lazy Load). Jab Admin Order detail page khole, tabhi history fetch ho, taaki page load slow na ho."