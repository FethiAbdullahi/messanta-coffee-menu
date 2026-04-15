import { useState, useCallback } from 'react'
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const uploadFile = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, WebP, or GIF)')
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Image must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
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
        // Extract file path from URL
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
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
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
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
            ${isDragging 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
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
                <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                <div className="p-3 bg-gray-100 rounded-full">
                  {isDragging ? (
                    <ImageIcon className="h-8 w-8 text-primary-500" />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {isDragging ? 'Drop image here' : 'Drag & drop an image'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    or click to browse (JPEG, PNG, WebP, GIF - max 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* URL input fallback */}
      <div className="mt-3">
        <div className="flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-xs text-gray-400">or enter URL</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={previewUrl || ''}
          onChange={(e) => {
            setPreviewUrl(e.target.value || null)
            if (e.target.value) {
              onImageUploaded(e.target.value)
            }
          }}
          className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>
  )
}

export default ImageUpload

