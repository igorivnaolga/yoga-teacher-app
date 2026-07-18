# Yoga Teacher

Mobile app for yoga teachers to plan classes, log what they taught, keep sequences fresh, and build courses.

## Stack

- React Native (Expo) + TypeScript
- Expo Router
- AsyncStorage for local persistence
- Jest + React Native Testing Library

## Project structure

```text
app/                 Expo Router screens
src/
  domain/            Pure business rules and types
  data/              Persistence and seed data
  features/          Feature UI and hooks
  shared/            Theme, UI primitives, navigation config
  test/              Shared test setup
```

## Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Open on Android
npm run ios        # Open on iOS
npm run web        # Open in browser
npm test           # Run tests once
npm run test:watch # Run tests in watch mode
npm run typecheck  # TypeScript check
```

## Current features

- App shell with tabs: **Plans**, **Calendar**, **Courses**, **Library**
- **Pose library**: searchable seeded catalog with category filters and pose detail
- **Class plans**: create/edit/delete plans, add poses, reorder sequence, local persistence
- **Teaching calendar**: month view, log taught classes by day, recently taught list
