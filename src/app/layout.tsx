// Root layout - 只用于传递 children 到 [locale] 布局
// 所有实际的 HTML 结构都在 src/app/[locale]/layout.tsx 中
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
