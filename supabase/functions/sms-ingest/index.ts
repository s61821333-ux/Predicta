import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let payload = null
  try {
    payload = await req.json()
  } catch (_error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const token = typeof payload?.token === 'string' ? payload.token.trim() : ''
  const rawAmount = payload?.amount
  const rawDescription = typeof payload?.description === 'string' ? payload.description.trim() : ''
  const rawCurrency = typeof payload?.currency === 'string' ? payload.currency.trim() : ''
  const rawCategory = typeof payload?.category === 'string' ? payload.category.trim() : ''
  const rawType = payload?.type === 'income' ? 'income' : 'expense'
  const rawStatus = payload?.status === 'future' ? 'future' : 'completed'

  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing token' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const amount = Number(rawAmount)
  if (!Number.isFinite(amount) || amount <= 0) {
    return new Response(JSON.stringify({ error: 'Invalid amount' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let txnDate = new Date()
  if (payload?.date) {
    const parsed = new Date(payload.date)
    if (Number.isNaN(parsed.getTime())) {
      return new Response(JSON.stringify({ error: 'Invalid date' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    txnDate = parsed
  }

  const { data: settings, error: settingsError } = await supabase
    .from('user_settings')
    .select('user_id, currency_code')
    .eq('sms_ingest_token', token)
    .maybeSingle()

  if (settingsError) {
    return new Response(JSON.stringify({ error: settingsError.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (!settings?.user_id) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let categoryId = null
  if (rawCategory) {
    const { data: userCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', settings.user_id)
      .eq('name', rawCategory)
      .maybeSingle()

    if (userCategory?.id) {
      categoryId = userCategory.id
    } else {
      const { data: systemCategory } = await supabase
        .from('categories')
        .select('id')
        .is('user_id', null)
        .eq('name', rawCategory)
        .maybeSingle()
      if (systemCategory?.id) categoryId = systemCategory.id
    }
  }

  const { data: inserted, error: insertError } = await supabase
    .from('transactions')
    .insert({
      user_id: settings.user_id,
      amount,
      type: rawType,
      currency: rawCurrency || settings.currency_code || 'ILS',
      description: rawDescription || null,
      date: txnDate.toISOString(),
      category_id: categoryId,
      is_temporary: false,
      status: rawStatus,
    })
    .select('id')
    .single()

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true, id: inserted.id }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
