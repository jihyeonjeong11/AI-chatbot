import { History } from "./(landing)/_sections/history";
import Header from "./_header/header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full">
      <Header />

      <div>{children}</div>
    </div>
  );
}
