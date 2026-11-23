# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Maestro Mobile Testing Setup

Maestro Studio is used to create and run automated mobile UI tests. It allows tests to be created and edited visually while interacting with a running emulator or simulator.

### Installing Maestro Studio

1. Download Maestro Studio from the [official Maestro installation guide](https://docs.maestro.dev/get-started/quickstart).

### Creating and Running Tests with Maestro Studio

1. Start an Android emulator or iOS simulator.
   - Android: Use Android Studio. If encountering issues, try Android 15 (API 35).
   - iOS: Use Xcode to install and launch an iOS Simulator (requires macOS).
2. Start the Expo development server from the project root using `npx expo start`.
3. Open the app on the emulator or simulator.
   - Android: Press `a` in the Expo terminal.
   - iOS: Press `i` in the Expo terminal.
4. Open Maestro Studio.
5. Connect to the emulator or simulator running the Workout Tracker by selecting it in Maestro Studio.
6. When creating a new test, give it an appropriate name and set the App ID to `host.exp.exponent` when using Expo Go.
7. Use Maestro Studio to interact with the app, inspect elements, and create or run tests.
8. Export the YAML test to the .maestro folder in this repository


## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **example** directory and create a blank **src/app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on [Using ESLint and Prettier](https://docs.expo.dev/guides/using-eslint/).
- If you'd like to set up unit testing, follow our guide on [Unit Testing with Jest](https://docs.expo.dev/develop/unit-testing/).
- Learn more about the TypeScript setup in this template in our guide on [Using TypeScript](https://docs.expo.dev/guides/typescript/).

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.