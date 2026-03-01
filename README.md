# InnerLoop

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)

Neighborhood volunteering platform for Chicago. Two roles: **Inner** (organizations posting tasks) and **Looper** (volunteers applying to help).

**Live:** [innerloopchi.github.io/innerloop.github.io](https://innerloopchi.github.io/innerloop.github.io/)

## Setup

```bash
git clone https://github.com/InnerLoopChi/innerloop.github.io.git
cd innerloop.github.io
npm install
npm run dev
```

Firebase is preconfigured. No env file needed.

## Demo accounts

Visit `/seed` first to populate the database. Password for everything is `demo1234`

**Loopers (volunteers)**
<looper@demo.com> is Maria G.
<looper2@demo.com> is Darius W.
<looper3@demo.com> is Jasmine R.

**Inners (organizations)**
<inner@demo.com> is Pilsen Community Center
<inner2@demo.com> is Logan Square Food Pantry
<inner3@demo.com> is The NaN Center

## Project structure

The app is a React Single Page Application (SPA), and all the core code lives inside the `src` folder.

At the root level of `src`, `App.jsx` handles all the React Router logic. It sets up public routes for guests and protected routes for authenticated users, making sure you get redirected to the login page if you try to view the feed without an account. It also wraps the whole app in our context providers.

For state management and backend connection, we kept things simple. The `lib/firebase.js` file initializes the Firebase connection. Then we use React Context (`contexts/AuthContext.jsx`) to manage the current user's authentication state and their Firestore profile data. That context provider listens for real time updates, so if a user's verified status or loop credits change in the database, the whole app knows about it instantly.

The `pages` folder contains the main full-screen views. `LandingPage`, `LoginPage`, and `SignUpPage` handle the public facing side. Once you're signed in, `FeedPage` is the main dashboard pulling all posts and letting you filter them. `MapPage` drops Leaflet into the app to show neighborhood markers and post locations. `MyTasksPage` is where organizations manage the people applying to their posts, and where volunteers check the status of their applications. We also have `MessagesPage` bringing the DM system to life, `CalendarPage` for a monthly schedule view, and `ProfilePage` where actual rewards can be claimed using volunteer credits.

Finally, the `components` folder holds the reusable UI pieces. `PostCard` handles displaying the volunteer task, checks if you've already applied, and has the apply/waitlist button. `CreatePost` is the modal where organizations actually write the posts. We also have `BottomNav` for the mobile-friendly tab bar at the bottom, and `NotificationBell` which sits in the top nav and listens to a dedicated Firestore collection to show unread alerts.

## Key features and how they work

**Feed and posts** use a Firestore `onSnapshot` listener on the `posts` collection. Inner users create posts with task capacity, schedule, tags, and neighborhood. Loopers see a filtered feed and can apply.

**Task applications** are stored as an `applicants` array inside each post document. When an Inner accepts or rejects, it updates the array entry status and creates a notification.

**Map** loads Leaflet dynamically and creates markers for each Chicago neighborhood. Marker size scales with post count. Clicking a marker shows posts for that area and tapping a post opens the full PostCard component.

**DMs** use a `conversations` collection with a `messages` subcollection. New conversations start with `status: pending`. The recipient has to accept before messages can be exchanged. Real time listeners keep both sides in sync.

**Notifications** are stored in a `notifications` collection filtered by `recipientId`. Triggers fire on task application accept/reject, new DM request, DM accepted, and new message received.

**Rewards** track verified volunteer hours as `loopCredits` on the user document. Loopers can redeem credits for rewards on their profile page.

## Firestore collections

`users` has user profiles, role, verified status, and loop credits
`posts` has volunteer tasks with schedule, capacity, and applicants array
`conversations` has DM threads with participant info and pending/accepted status
`conversations/{id}/messages` has individual messages in a thread
`notifications` has notification entries filtered by recipientId
`reviews` has reviews left by Inners for Loopers

## Deployment

Built with Vite, deployed to GitHub Pages via `gh-pages` branch. The `404.html` redirect handles SPA routing on GitHub Pages.

```bash
npm run build
```
