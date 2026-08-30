# HEAVELY Style Studio

Build HEAVELY — Your Personal Style Studio

Build a complete, production-quality, responsive full-stack web application called HEAVELY.

Brand

Name: HEAVELY
Tagline: Wear your own kind of heaven.

HEAVELY is a creative digital styling studio that helps users discover new outfits using the clothes, jewellery, accessories and beauty items they already own.

It should feel like a combination of:

a dreamy digital wardrobe

a personal stylist

an interactive outfit remix studio

a beauty/style recommendation space

a creative photobooth

a personal fashion diary

This must NOT look like a generic e-commerce website or a generic SaaS dashboard.

The experience should feel feminine, dreamy, playful, premium, highly visual, interactive and memorable.

1. CORE USER PROBLEM

Users often have plenty of clothes and accessories but still feel:

"I have nothing to wear."

They may also struggle with:

matching jewellery with an outfit

deciding which accessories work together

deciding makeup and hairstyle for a particular look

styling the same clothing item in different ways

deciding what to wear for a particular occasion

creating a complete coordinated look

finding creative ways to reuse existing clothes

HEAVELY solves this by allowing users to digitize what they already own and creatively remix it into complete looks.

The philosophy is:

Don't buy a new look. Discover a new look in what you already own.

2. IMPORTANT PRODUCT DIRECTION

Do NOT build this as a shopping platform.

Do NOT prioritize product purchasing.

Do NOT make the homepage look like Amazon, Myntra, or a fashion marketplace.

The user's own wardrobe must be the center of the experience.

The website should feel like opening a beautiful personal dressing room.

3. TECH STACK

Use a modern full-stack architecture.

Preferred stack:

Frontend

Next.js

React

TypeScript

Tailwind CSS

Framer Motion or equivalent animation library

Backend

Next.js server/API routes or a clean backend service

REST or typed API architecture

Proper server-side validation

Database

Use PostgreSQL or Supabase.

Store:

users

clothing items

jewellery

accessories

shoes

beauty preferences

outfits

saved looks

photobooth photos

style preferences

outfit history

Authentication

Implement:

Sign up

Login

Logout

Password reset

Protected user dashboard

Use secure authentication.

Storage

Implement image storage for:

clothing photos

jewellery photos

accessory photos

profile photos

saved photobooth images

Do not store large image files directly inside database records.

Use object/file storage and save references in the database.

4. WEBSITE STRUCTURE

Create these major routes:

/

/about

/auth/login

/auth/signup

/dashboard

/closet

/closet/clothes

/closet/jewellery

/closet/accessories

/closet/shoes

/style-me

/remix

/look

/beauty

/photobooth

/looks

/profile

/settings

5. HOMEPAGE — MAKE IT MEMORABLE

The homepage should immediately communicate the HEAVELY concept.

Hero section:

Large elegant HEAVELY logo.

Headline:

Wear your own kind of heaven.

Supporting text:

Your wardrobe already has more possibilities than you think.

Primary CTA:

Enter My Closet →

Secondary CTA:

Explore HEAVELY

Visual concept:

Create a dreamy interactive wardrobe scene.

Possible elements:

floating clothing pieces

jewellery slowly rotating

ribbons

sparkles

soft clouds

subtle stars

fashion sketches

floating photographs

animated wardrobe doors

As the user scrolls, the wardrobe should visually transform into the HEAVELY styling studio.

Use tasteful motion, not excessive animation.

6. VISUAL DESIGN SYSTEM

Create a complete design system.

Main aesthetic

Dreamy feminine fashion editorial + modern Gen-Z creative interface.

Use:

soft pastel pink

powder blue

cream

pearl white

subtle lavender

muted rose

small amounts of dark text for contrast

Avoid making every section pink.

Use plenty of whitespace.

Typography

Use:

elegant serif/display font for major headings

clean modern sans-serif for UI

optional handwritten accent font for small decorative elements

Typography should feel editorial rather than childish.

UI details

Use:

rounded cards

glass-like panels where appropriate

soft shadows

thin borders

subtle gradients

organic shapes

magazine/editorial layouts

Polaroid-style cards

scrapbook elements

tiny decorative stars/hearts/ribbons

Do NOT use excessive emojis.

Use custom SVG icons or a professional icon library.

7. DASHBOARD

After login, the dashboard should feel like the user's personal style room.

Show:

Good morning, [Name] ✨

Then:

Today's Style Mood

Example:

Soft • Romantic • Effortless

Show:

Your Closet

124 pieces

Saved Looks

18 looks

Style Streak

7 days

Today's Inspiration

Display one dynamically generated outfit from the user's wardrobe.

Main CTA:

Style Me

Secondary actions:

Remix a Look

Open Closet

Enter Photobooth

8. DIGITAL CLOSET

Create a beautiful visual wardrobe.

Categories:

Tops

Bottoms

Dresses

Ethnic wear

Outerwear

Shoes

Jewellery

Bags

Accessories

Users must be able to:

upload image

drag and drop image

take/upload a photo

name the item

choose category

choose color

choose style

choose season

choose occasion

edit item

delete item

favorite item

When uploading an item, provide an optional automated categorization flow.

Example:

User uploads a photo of a pink top.

System can suggest:

Category: Top Color: Pink Style: Casual Season: Summer

Allow the user to correct the suggestions.

9. JEWELLERY + ACCESSORY CLOSET

Treat jewellery and accessories as first-class wardrobe items.

Categories:

Jewellery

Earrings

Necklace

Bracelet

Ring

Anklet

Accessories

Bags

Sunglasses

Hair accessories

Belts

Scarves

Watches

Users should be able to upload their actual items.

The recommendation engine must use these items when generating outfits.

10. STYLE ME — THE HEART OF HEAVELY

Create a highly visual styling wizard.

Ask the user:

What are you dressing for?

Examples:

College

Casual day

Party

Birthday

Wedding

Festival

Dinner

Café

Photoshoot

Vacation

Custom

Then:

What's your vibe?

Examples:

Soft

Cute

Elegant

Dreamy

Minimal

Y2K

Romantic

Traditional

Edgy

Playful

Then:

What's the weather?

Hot

Warm

Cool

Rainy

Cold

Then:

How do you want to feel?

Examples:

Confident

Comfortable

Cute

Elegant

Effortless

Bold

Finally:

CREATE MY LOOK ✨

11. OUTFIT RECOMMENDATION ENGINE

Create a recommendation system that works primarily with the user's existing wardrobe.

Do NOT randomly recommend products from the internet.

The system should consider:

occasion

selected vibe

weather

clothing category

colors

complementary colors

style compatibility

jewellery compatibility

accessory compatibility

footwear

user preferences

previous saved outfits

recently worn items

Generate multiple options.

Example:

LOOK 01 — Soft Romantic

👗 Pink top
🤍 White skirt
💍 Pearl earrings
🎀 Pink hair ribbon
👜 White bag
👟 White shoes

Beauty

💄 Peach/pink makeup direction
💇 Soft waves

Buttons:

♡ Save

↻ Remix

Customize

Try Another

12. REMIX STUDIO

This must be one of the most creative parts of the website.

Create an interactive outfit canvas.

Users can visually combine wardrobe pieces.

Example:

TOP + BOTTOM + SHOES + BAG + JEWELLERY + ACCESSORY

Allow:

drag and drop

replace

remove

shuffle

lock an item

remix selected category

save outfit

Important feature:

LOCK ITEM 🔒

Example:

User locks:

Pink top

Then clicks:

REMIX

HEAVELY changes the rest while keeping the pink top.

Also allow:

REMIX JEWELLERY

REMIX ACCESSORIES

REMIX ENTIRE LOOK

This makes the website genuinely interactive instead of just displaying AI-generated cards.

13. COMPLETE MY LOOK

After creating an outfit, show:

Complete My Look ✨

Sections:

👗 Outfit

Selected clothing.

💍 Jewellery

Best matching jewellery from the user's collection.

👜 Accessories

Matching bag, belt, sunglasses, etc.

👠 Shoes

Matching footwear.

💇 Hairstyle

Suggest a hairstyle based on the overall aesthetic.

💄 Makeup

Provide high-level aesthetic makeup suggestions such as:

soft pink

peachy

natural

classic

glam

berry

warm neutral

Do not provide medical/skin-treatment advice.

The interface should show each recommendation as a beautiful visual card.

14. BEAUTY BOARD

Create a dedicated beauty inspiration page.

User can choose:

Hair:

Open hair

Ponytail

Bun

Braids

Soft waves

Half-up

Makeup vibe:

Natural

Soft pink

Peach

Classic

Glossy

Glam

Minimal

The system should match these choices to the selected outfit aesthetic.

The goal is coordination, not judging the user's appearance.

15. THE HEAVELY PHOTOBOOTH

This should be one of the signature features.

After the user finishes styling:

CTA:

READY?

Enter HEAVELY BOOTH →

Create a beautiful photobooth interface.

Features:

Camera

Use browser camera permissions where available.

Also allow:

Upload Photo

Photo layouts

Single portrait

2-grid

3-grid

4-grid

Polaroid

Film strip

Magazine cover

Scrapbook

Themes

Dreamy

Y2K

Coquette-inspired

Vintage

Soft

Starry

Floral

Editorial

Effects

Film grain

Sparkles

Light leaks

Soft glow

Stars

Hearts

Flowers

Decorative elements

Allow users to drag stickers around the photo.

Text

Allow custom text.

Example:

HEAVELY LOOK 08

or

AUGUST 2026

or

today's little moment ♡

16. MOTION + INTERACTION

This is extremely important.

Use animations intentionally.

Examples:

wardrobe doors opening

clothing cards floating slightly

jewellery rotating subtly

hover effects

smooth page transitions

cards expanding into full looks

drag-and-drop interactions

animated remix shuffle

camera countdown

flash effect after taking photo

Polaroid photo dropping onto a desk

scrapbook pages turning

subtle cursor interactions

Respect prefers-reduced-motion.

Do not make the site slow or overwhelming.

17. MY LOOKS

Create a personal fashion diary.

Each saved look should contain:

outfit

jewellery

accessories

hairstyle

makeup direction

date created

occasion

vibe

optional photo

Display them as:

Polaroids

editorial cards

scrapbook grid

calendar view

Allow:

♡ Favorite

Edit

Remix

Delete

18. USER PROFILE

Create:

My Style

Favorite vibes:

Soft

Y2K

Minimal

Traditional

etc.

Favorite colors.

Preferred occasions.

Style preferences.

Allow users to edit their preferences.

19. BACKEND REQUIREMENTS

Build the backend properly.

Create database models/tables for:

User

id

name

email

password/auth reference

profile image

createdAt

WardrobeItem

id

userId

name

category

subcategory

imageUrl

color

secondaryColors

style

season

occasion

favorite

createdAt

Outfit

id

userId

name

occasion

vibe

weather

itemIds

beautyRecommendations

createdAt

SavedLook

id

userId

outfitId

photoUrl

createdAt

StylePreferences

userId

favoriteColors

favoriteStyles

preferredOccasions

beautyPreferences

PhotoSession

id

userId

theme

layout

photoUrl

createdAt

Use proper relationships and indexes.

20. API REQUIREMENTS

Create clean API endpoints/server actions for:

authentication

wardrobe CRUD

image upload

wardrobe categorization

outfit generation

outfit saving

outfit remixing

recommendation retrieval

profile/preferences

photobooth sessions

saved photos

Validate all inputs on the server.

Never trust client-side validation alone.

Handle:

loading

errors

empty states

failed uploads

invalid files

unauthorized requests

expired sessions

21. IMAGE UPLOAD SAFETY

Allow common image formats.

Validate:

MIME type

file size

dimensions where appropriate

Reject invalid files.

Do not expose private storage URLs unnecessarily.

Users should only be able to access their own private wardrobe images unless they explicitly choose to share something.

22. PRIVACY

This is especially important because users may upload personal photos.

Implement:

private-by-default wardrobe

protected user data

authorization checks

secure image access

account deletion

delete uploaded photos

delete wardrobe items

delete saved looks

Do not make uploaded photos public by default.

23. RESPONSIVE DESIGN

The website must work beautifully on:

mobile

tablet

laptop

desktop

Prioritize mobile because users will likely use the camera and upload wardrobe photos from phones.

The photobooth should be especially mobile-friendly.

Use responsive navigation.

On mobile, use a beautiful bottom navigation:

Home | Closet | Style | Booth | Looks

24. REAL WEBSITE DETAILS

Make this feel like a real launchable website.

Add:

Footer

HEAVELY

Wear your own kind of heaven.

Links:

About

How It Works

Privacy

Terms

Contact

Help

Social icons:

Instagram

Pinterest

TikTok

Also include:

© 2026 HEAVELY. All rights reserved.

Create proper metadata:

Title:

HEAVELY — Wear Your Own Kind of Heaven

Description:

A creative digital wardrobe and personal styling studio that helps you remix what you already own.

Add favicon using a simple HEAVELY-inspired symbol.

Add Open Graph metadata.

Use clean semantic URLs.

25. DEMO MODE

Very important for the first launch.

Provide a Try Demo option so visitors can experience HEAVELY without creating an account.

Populate demo mode with fictional wardrobe items.

Example:

pink cardigan

white skirt

denim jacket

floral dress

pearl earrings

gold hoops

pink handbag

white sneakers

ribbon

Demo users should be able to:

Open demo closet

Create a look

Remix it

See beauty suggestions

Enter photobooth

Save a temporary result

Clearly label demo data.

26. EMPTY STATES

Do NOT show boring empty pages.

For example, if the closet is empty:

Instead of:

No items found.

Show:

Your closet is waiting for its first little piece. 🎀

CTA:

Add Your First Item

Similarly:

No saved looks:

Your first HEAVELY look belongs here.

This is part of the brand experience.

27. ACCESSIBILITY

Implement:

semantic HTML

keyboard navigation

visible focus states

sufficient contrast

alt text

accessible buttons

accessible forms

screen-reader labels

reduced-motion support

Do not sacrifice accessibility for aesthetics.

28. PERFORMANCE

The website must remain fast despite the visual design.

Use:

lazy loading

optimized images

responsive image sizes

code splitting

efficient animations

compressed assets

caching where appropriate

Do not load huge images unnecessarily.

29. SECURITY

Implement:

server-side authorization

secure authentication

input validation

rate limiting where appropriate

secure file upload handling

protection against unauthorized database access

environment variables for secrets

never expose API keys in frontend code

Never hard-code secrets.

Create .env.example.

30. ERROR + LOADING EXPERIENCE

Create beautiful branded loading states.

Example:

Styling your look... ✨

with a subtle animated wardrobe/sparkle.

Errors should feel friendly:

Something went a little off-script.
Let's try that again. ♡

But still provide a functional retry button.

31. DESIGN PRINCIPLE

The most important design rule:

HEAVELY should feel like a creative experience, not a dashboard.

Avoid:

generic admin panels

excessive tables

boring grids

default Bootstrap styling

generic blue buttons

excessive gradients

template-looking SaaS sections

Prefer:

editorial layouts

immersive sections

visual storytelling

beautiful cards

interactive wardrobe elements

subtle animations

playful microinteractions

strong typography

whitespace

personalized content

32. DO NOT FAKE FUNCTIONALITY

If an AI feature cannot actually be implemented with the available APIs, do not pretend it works.

Create a clean abstraction such as:

/api/style/recommend

and implement a deterministic wardrobe matching algorithm first.

For example:

Filter by occasion.

Filter by weather.

Match compatible categories.

Score color compatibility.

Score style compatibility.

Score accessory compatibility.

Consider user preferences.

Avoid recently used combinations.

Return top 3–5 looks.

Make the architecture ready for an AI model to replace or enhance this later.

33. RECOMMENDATION ENGINE — FIRST VERSION

Do NOT require an expensive AI API just to make the basic product work.

Create a rule-based styling engine.

Example scoring:

Occasion match       +30
Style/vibe match     +25
Color compatibility  +20
Weather suitability  +10
Accessory match      +10
User preference       +5


Return a compatibility score.

Example:

92% Style Match

Use the score as a playful recommendation indicator, NOT as a judgment of the user's appearance.

34. FUTURE AI ARCHITECTURE

Structure the code so future features can be added:

AI image categorization

background removal

natural-language style requests

AI outfit recommendations

virtual try-on

AI hairstyle/makeup visualization

AI photobooth effects

But the base website must work without those expensive features.

35. SAMPLE NATURAL-LANGUAGE STYLING

Eventually allow:

"I want something cute for college using my pink top."

The backend should interpret:

occasion = college

vibe = cute

requiredItem = pink top

Then generate suitable combinations.

Another example:

"Style my white skirt for a birthday party."

The system should lock the white skirt and remix everything else.

36. FINAL USER EXPERIENCE

The ideal journey should feel like:

OPEN HEAVELY

↓

☁️ Enter your dreamy closet

↓

👗 Add what you own

↓

🎀 Choose your mood

↓

✨ HEAVELY styles you

↓

🪄 Remix until you love it

↓

💄 Complete your look

↓

🪞 Get ready

↓

📸 Enter the HEAVELY Booth

↓

💗 Capture the moment

↓

📔 Save it to your HEAVELY diary

37. BUILD QUALITY

Do not create a static landing page.

Build the actual application.

The final project should include:

functioning frontend

functioning backend

database

authentication

image upload

wardrobe persistence

recommendation engine

outfit creation

remix functionality

saved looks

photobooth

responsive design

error handling

loading states

accessibility

security

deployment configuration

Use realistic demo data so the application looks alive immediately after launch.

Generate clean, maintainable, well-organized code.

Use reusable components.

Keep business logic separate from UI components.

Add comments only where they genuinely help.

Before finishing, test all major user flows:

Sign up

Login

Add wardrobe item

Edit wardrobe item

Delete wardrobe item

Generate outfit

Remix outfit

Save look

Enter photobooth

Capture/upload photo

Save photo

Logout

Login again and verify persistence

The final result should feel like a real fashion-tech product, not a college-project demo.

FINAL BRAND STATEMENT

HEAVELY

Wear your own kind of heaven.

A place where your closet becomes your playground.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://style-heaven-closet.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/11c4e278-131d-40f2-9b9f-5b5f741deba8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
