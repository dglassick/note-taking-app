import "./globals.css";
import "./styles/index.css";
import "./styles/prosemirror.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
	title: "NotesGalore",
	description: "A simple note-taking app",
};
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body className={inter.className}>
					<nav className="fixed right-8 top-8 z-40">
						<SignedIn>
							{/* Mount the UserButton component */}
							<UserButton
								afterSignOutUrl="/"
								afterMultiSessionSingleSignOutUrl="/"
								afterSwitchSessionUrl="/"
								appearance={{ variables: { colorPrimary: "#000" } }}
							/>
						</SignedIn>
						<SignedOut>{/* Signed out users get sign in button */}</SignedOut>
					</nav>
					<Providers>
					{children}
					</Providers>
					<Toaster />
				</body>
			</html>
		</ClerkProvider>
	);
}