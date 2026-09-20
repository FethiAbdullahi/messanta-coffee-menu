import { useState, useCallback, useEffect } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  currentImageUrl?: string | null
  onImageUploaded: (url: string) => void
  onImageRemoved?: () => void
  bucket?: string
  folder?: string
}

function resolvePreviewSrc(url: string): string {
  if (!url.trim()) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return url
  return `/${url}`
}

const ImageUpload = ({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  bucket = 'product-images',
  folder = 'products'
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)

  useEffect(() => {
    setPreviewUrl(currentImageUrl || null)
  }, [currentImageUrl])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const uploadFile = async (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, WebP, or GIF)')
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Image must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path)

      setPreviewUrl(publicUrl)
      onImageUploaded(publicUrl)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image. Make sure Supabase Storage is configured.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      uploadFile(files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      uploadFile(files[0])
    }
  }

  const handleRemove = async () => {
    if (previewUrl && previewUrl.includes(bucket)) {
      try {
        const urlParts = previewUrl.split(`${bucket}/`)
        if (urlParts.length > 1) {
          const filePath = urlParts[1]
          await supabase.storage.from(bucket).remove([filePath])
        }
      } catch (error) {
        console.error('Error removing file:', error)
      }
    }

    setPreviewUrl(null)
    onImageRemoved?.()
  }

  return (
    <div className="w-full">
      {previewUrl ? (
        <div className="relative group">
          <img
            src={resolvePreviewSrc(previewUrl)}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl border border-slate-200 shadow-sm"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
            ${isDragging 
              ? 'border-teal-500 bg-teal-50' 
              : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
            }
            ${isUploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          
          <div className="flex flex-col items-center space-y-3">
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 text-teal-600 animate-spin" />
                <p className="text-sm text-slate-600">Uploading...</p>
              </>
            ) : (
              <>
                <div className="p-3 bg-slate-100 rounded-full">
                  {isDragging ? (
                    <ImageIcon className="h-8 w-8 text-teal-600" />
                  ) : (
                    <Upload className="h-8 w-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {isDragging ? 'Drop image here' : 'Drag & drop an image'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    or click to browse (JPEG, PNG, WebP, GIF - max 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* URL input — optional helper; type=text so relative paths like /menu/foo.jpg work */}
      <div className="mt-3">
        <div className="flex items-center">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-3 text-xs text-slate-400">
            {previewUrl ? 'image path / URL (optional)' : 'or enter path / URL'}
          </span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>
        <input
          type="text"
          placeholder="/menu/item.jpg or https://…"
          value={previewUrl || ''}
          onChange={(e) => {
            const value = e.target.value.trim()
            if (!value) {
              setPreviewUrl(null)
              onImageRemoved?.()
              return
            }
            setPreviewUrl(value)
            onImageUploaded(value)
          }}
          className="mt-2 w-full px-3 py-2.5 text-sm text-slate-800 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400"
        />
      </div>
    </div>
  )
}

export default ImageUpload
