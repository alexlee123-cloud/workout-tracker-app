// The coach tabs. Everything in this (tabs) folder is a tab screen.
// The folder name in parentheses is a "group": it organizes files without
// changing the URL, so (tabs)/exercises.tsx is still just "/exercises".
import AppTabs from '@/components/app-tabs';

export default function TabsLayout() {
    return <AppTabs />;
}
