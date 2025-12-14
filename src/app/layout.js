import "./globals.css";
import "./styles/style.scss";
import "./styles/responsive.scss";
import Header from "./components/header";
import Footer from "./components/footer";
export const metadata = {
  title: "AST UK",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
