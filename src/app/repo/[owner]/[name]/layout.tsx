import { ReactNode } from "react"

export default function RepoLayout({ children }: { children: ReactNode }) {
  return (
    <div >
      <main className="">{children}</main>
    </div>
  )
}
