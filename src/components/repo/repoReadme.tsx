"use client"


export default function RepoReadme({ readme }: { readme: string }) {
  if (!readme) return null
  return (

      <div
        className="markdown text-white bg-gray-900 rounded-xl p-4 space-y-4 border border-gray-700"
        dangerouslySetInnerHTML={{ __html: readme }}
      />
  )
}
