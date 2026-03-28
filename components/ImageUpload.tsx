'use client'

import { useState, useRef } from 'react'

interface Props {
  onUpload: (urls: string[]) => void
  existingUrls: string[]
}

export default function ImageUpload({ onUpload, existingUrls }: Props) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      // Convert to base64 data URL for simplicity (no external storage needed)
      const reader = new FileReader()
      const url = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
      newUrls.push(url)
    }

    onUpload([...existingUrls, ...newUrls])
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  function removeImage(index: number) {
    onUpload(existingUrls.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {existingUrls.map((url, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`参考画像${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              aria-label={`参考画像${i + 1}を削除`}
              className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
            >
              x
            </button>
          </div>
        ))}
      </div>
      <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-all ${uploading ? 'opacity-50' : ''}`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {uploading ? 'アップロード中...' : '画像を追加（参考イメージ・スクショなど）'}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  )
}
