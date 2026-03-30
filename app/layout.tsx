import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student XX-XXX-XXX",
  description: "sopra-fs26-template-client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              // general theme options are set in token, meaning all primary elements (button, menu, ...) will have this color
              colorPrimary: "#2f74b5", // selected input field border will have this color as well
              borderRadius: 10,
              colorText: "#2b2f35",
              fontSize: 16,

              // Alias Token
              colorBgContainer: "#f4f8fd",
            },
            // if a component type needs special styling, setting here will override default options set in token
            components: {
              Button: {
                colorPrimary: "#2f74b5", // this will color all buttons in the new shared blue theme
                algorithm: true, // enable algorithm (redundant with line 33 but here for demo purposes)
                controlHeight: 42,
              },
              Input: {
                colorBorder: "#b2c6db",
                colorTextPlaceholder: "#6f86a0",
                algorithm: false, // disable algorithm (line 32)
              },
              Form: {
                labelColor: "#365777",
                algorithm: theme.defaultAlgorithm, // specify a specifc algorithm instead of true/false
              },
              Card: {},
            },
          }}
        >
          <AntdRegistry>
            <AntdApp>
              <div className="app-shell">{children}</div>
            </AntdApp>
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
