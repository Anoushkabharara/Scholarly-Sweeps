import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../components/AuthContext";

export const metadata = {
  title: "Scholarly Sweeps — Demo",
  description: "Wireframe prototype: dorm/apartment cleaning bookings for UTD students."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
