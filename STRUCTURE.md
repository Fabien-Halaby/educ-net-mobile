```sh
educ-net-mobile/
├── app/
│   ├── (auth)/              # Auth stack
│   │   ├── welcome.tsx      # Welcome screen
│   │   ├── login.tsx        # Login screen
│   │   ├── register.tsx     # Registration
│   │   └── pending.tsx      # Awaiting approval
│   ├── (tabs)/              # Main tab navigation
│   │   ├── _layout.tsx      # Tab layout
│   │   ├── index.tsx        # Home feed
│   │   ├── channels.tsx     # Channels list
│   │   ├── notifications.tsx # Notifications
│   │   └── profile.tsx      # User profile
│   ├── channel/
│   │   └── [id].tsx         # Channel detail
│   ├── post/
│   │   └── [id].tsx         # Post detail
│   ├── create-post.tsx      # Create new post
│   ├── edit-profile.tsx     # Edit profile
│   └── _layout.tsx          # Root layout
├── components/
│   ├── PostCard.tsx         # Post display
│   ├── ChannelItem.tsx      # Channel list item
│   ├── CommentItem.tsx      # Comment display
│   ├── Header.tsx           # Screen headers
│   ├── Avatar.tsx           # User avatar
│   ├── Button.tsx           # Custom button
│   └── LoadingSpinner.tsx   # Loading state
├── services/
│   ├── api.ts               # API client
│   ├── auth.ts              # Auth service
│   ├── notifications.ts     # Push notifications
│   └── storage.ts           # AsyncStorage wrapper
├── hooks/
│   ├── useAuth.ts           # Authentication hook
│   ├── usePosts.ts          # Posts data hook
│   ├── useChannels.ts       # Channels data hook
│   └── useNotifications.ts  # Notifications hook
├── contexts/
│   └── AuthContext.tsx      # Global auth state
├── types/
│   └── index.ts             # TypeScript types
├── constants/
│   ├── Colors.ts            # Color palette
│   └── Layout.ts            # Layout constants
├── assets/
│   ├── images/              # Image assets
│   └── fonts/               # Custom fonts
├── app.json                 # Expo configuration
├── .env.example
├── package.json
├── tsconfig.json
├── README.md
└── STRUCTURE.md
```