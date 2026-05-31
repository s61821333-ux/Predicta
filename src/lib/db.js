import { supabase } from './supabase'

export async function getAuthUserId() {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export async function fetchUserProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, first_name, last_name, email, phone, plan_type, avatar_url, partner_id, created_at')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function updateUserProfile(userId, fields) {
  const { data, error } = await supabase
    .from('users')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

export async function fetchUserSettings(userId) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export async function updateUserSettings(userId, fields) {
  const { data, error } = await supabase
    .from('user_settings')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()
  return { data, error }
}

export async function fetchCategories(userId) {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, type, color_hex, icon_name, user_id')
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .order('name')
  return { data: data ?? [], error }
}

export async function createCategory(userId, { name, type = 'expense', color_hex, icon_name }) {
  const { data, error } = await supabase
    .from('categories')
    .insert({ user_id: userId, name, type, color_hex, icon_name })
    .select()
    .single()
  return { data, error }
}

export async function deleteCategory(categoryId) {
  const { error } = await supabase.from('categories').delete().eq('id', categoryId)
  return { error }
}

export async function fetchTransactions(userId, { limit, month, year, status } = {}) {
  let query = supabase
    .from('transactions')
    .select(`
      id, amount, type, currency, description, date, is_temporary, status, created_at,
      category:categories ( id, name, color_hex, icon_name )
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (limit) query = query.limit(limit)
  if (status) query = query.eq('status', status)

  if (month && year) {
    const start = new Date(year, month - 1, 1).toISOString()
    const end = new Date(year, month, 0, 23, 59, 59).toISOString()
    query = query.gte('date', start).lte('date', end)
  }

  const { data, error } = await query
  return { data: data ?? [], error }
}

export async function createTransaction(userId, txn) {
  const { data, error } = await supabase
    .from('transactions')
    .insert({ user_id: userId, ...txn })
    .select(`
      id, amount, type, description, date, is_temporary, status,
      category:categories ( id, name, color_hex, icon_name )
    `)
    .single()
  return { data, error }
}

export async function deleteTransaction(transactionId) {
  const { error } = await supabase.from('transactions').delete().eq('id', transactionId)
  return { error }
}

export async function fetchMonthlySummary(userId, month, year) {
  const { data, error } = await fetchTransactions(userId, { month, year, status: 'completed' })
  if (error) return { income: 0, expense: 0, net: 0, error }

  let income = 0
  let expense = 0

  for (const t of data) {
    if (t.is_temporary) continue
    const amt = Number(t.amount)
    if (t.type === 'income') income += amt
    else expense += amt
  }

  return { income, expense, net: income - expense, error: null }
}

export async function fetchTotalBalance(userId) {
  const { data, error } = await fetchTransactions(userId, { status: 'completed' })
  if (error) return { balance: 0, error }

  let balance = 0
  for (const t of data) {
    if (t.is_temporary) continue
    const amt = Number(t.amount)
    balance += t.type === 'income' ? amt : -amt
  }
  return { balance, error: null }
}

export async function fetchBudgetsWithSpent(userId, month, year) {
  const { data: budgets, error: budgetError } = await supabase
    .from('budgets')
    .select(`
      id, amount_limit,
      category:categories ( id, name, color_hex, icon_name )
    `)
    .eq('user_id', userId)
    .eq('month', month)
    .eq('year', year)

  if (budgetError) return { data: [], error: budgetError }

  const { data: txns } = await fetchTransactions(userId, { month, year, status: 'completed' })

  const spentByCategory = {}
  for (const t of txns ?? []) {
    if (t.type !== 'expense' || t.is_temporary || !t.category?.id) continue
    spentByCategory[t.category.id] = (spentByCategory[t.category.id] ?? 0) + Number(t.amount)
  }

  return {
    data: (budgets ?? []).map((b) => ({
      id: b.id,
      label: b.category?.name ?? '—',
      budget: Number(b.amount_limit),
      spent: spentByCategory[b.category?.id] ?? 0,
      color: b.category?.color_hex ?? '#5e5e5e',
    })),
    error: null,
  }
}

export async function upsertBudget(userId, { categoryId, month, year, amountLimit }) {
  const { data, error } = await supabase
    .from('budgets')
    .upsert(
      {
        user_id: userId,
        category_id: categoryId,
        month,
        year,
        amount_limit: amountLimit,
      },
      { onConflict: 'user_id,category_id,month,year' },
    )
    .select()
    .single()
  return { data, error }
}

export async function fetchCategoryBreakdown(userId, month, year) {
  const { data: txns, error } = await fetchTransactions(userId, { month, year, status: 'completed' })
  if (error) return { data: [], error }

  const totals = {}
  let totalExpense = 0

  for (const t of txns) {
    if (t.type !== 'expense' || t.is_temporary) continue
    const catName = t.category?.name ?? 'אחר'
    const amt = Number(t.amount)
    if (!totals[catName]) {
      totals[catName] = { amount: 0, color: t.category?.color_hex ?? '#8e7164' }
    }
    totals[catName].amount += amt
    totalExpense += amt
  }

  const data = Object.entries(totals)
    .map(([cat, { amount, color }]) => ({
      cat,
      amount,
      color,
      pct: totalExpense ? Math.round((amount / totalExpense) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  return { data, totalExpense, error: null }
}

export async function fetchCashflowByMonth(userId, monthsBack = 6) {
  const now = new Date()
  const results = []

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    const { income, expense } = await fetchMonthlySummary(userId, month, year)
    results.push({
      monthIndex: d.getMonth(),
      income,
      expense,
      forecast: i === monthsBack - 1 && d.getMonth() === now.getMonth(),
    })
  }

  return { data: results, error: null }
}

export async function fetchChatMessages(userId) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, is_ai, title, text, stats_payload, action_label, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  return { data: data ?? [], error }
}

export async function insertChatMessage(userId, message) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ user_id: userId, ...message })
    .select()
    .single()
  return { data, error }
}
