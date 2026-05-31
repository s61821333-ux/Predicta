import { supabase } from './supabase'

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024
export const AVATAR_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function validateAvatarFile(file) {
  if (!file) {
    return { ok: false, error: 'לא נבחר קובץ' }
  }

  if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
    return {
      ok: false,
      error: 'סוג קובץ לא נתמך. השתמש ב-JPEG, PNG, WebP או GIF.',
    }
  }

  if (file.size > AVATAR_MAX_BYTES) {
    return {
      ok: false,
      error: 'הקובץ גדול מדי. הגודל המקסימלי הוא 2MB.',
    }
  }

  return { ok: true, error: null }
}

function extensionFromFile(file) {
  const fromName = file.name.split('.').pop()?.toLowerCase()
  if (fromName && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fromName)) {
    return fromName === 'jpeg' ? 'jpg' : fromName
  }
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  }
  return map[file.type] ?? 'jpg'
}

export async function uploadAvatar(userId, file) {
  const validation = validateAvatarFile(file)
  if (!validation.ok) {
    return { publicUrl: null, error: { message: validation.error } }
  }

  const ext = extensionFromFile(file)
  const path = `${userId}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: '3600',
    })

  if (uploadError) {
    return {
      publicUrl: null,
      error: { message: uploadError.message || 'העלאת הקובץ נכשלה' },
    }
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)

  if (!data?.publicUrl) {
    return { publicUrl: null, error: { message: 'לא ניתן לקבל כתובת לתמונה' } }
  }

  return { publicUrl: data.publicUrl, error: null }
}
