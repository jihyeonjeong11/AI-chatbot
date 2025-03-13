import { appConfig } from "../../app-config";
import Footer from "../../components/footer";
import Header from "./_header/header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full">
      {appConfig.mode === "live" && <Header />}
      <div>{children}</div>
      {appConfig.mode === "comingSoon" ? null : <Footer />}
    </div>
  );
}
