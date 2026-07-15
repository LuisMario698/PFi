'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ─── ACCOUNTS ───────────────────────────────────────────────

export async function createAccount(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const type = formData.get('type') as 'bank' | 'cash' | 'credit'
  const balance = parseFloat(formData.get('balance') as string) || 0

  const { error } = await supabase.from('accounts').insert({
    user_id: user.id,
    name,
    type,
    balance,
  })

  if (error) {
    return redirect('/accounts?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/accounts')
  revalidatePath('/dashboard')
  redirect('/accounts')
}

export async function deleteAccount(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id') as string

  await supabase.from('accounts').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/accounts')
  revalidatePath('/dashboard')
  redirect('/accounts')
}

// ─── CATEGORIES ─────────────────────────────────────────────

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const type = formData.get('type') as 'income' | 'expense'
  const color = formData.get('color') as string || '#3b82f6'

  const { error } = await supabase.from('categories').insert({
    user_id: user.id,
    name,
    type,
    color,
  })

  if (error) {
    return redirect('/categories?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/categories')
  redirect('/categories')
}

export async function deleteCategory(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id') as string

  await supabase.from('categories').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/categories')
  redirect('/categories')
}

// ─── TRANSACTIONS ───────────────────────────────────────────

export async function createTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const amount = parseFloat(formData.get('amount') as string)
  const type = formData.get('type') as 'income' | 'expense'
  const account_id = formData.get('account_id') as string
  const category_id = formData.get('category_id') as string
  const notes = formData.get('notes') as string || ''
  const date = formData.get('date') as string || new Date().toISOString()

  // 1. Insert the transaction
  const { error } = await supabase.from('transactions').insert({
    user_id: user.id,
    amount,
    type,
    account_id,
    category_id,
    notes,
    date,
  })

  if (error) {
    return redirect('/add?error=' + encodeURIComponent(error.message))
  }

  // 2. Update account balance
  const { data: account } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', account_id)
    .single()

  if (account) {
    const newBalance = type === 'income'
      ? account.balance + amount
      : account.balance - amount

    await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', account_id)
  }

  revalidatePath('/dashboard')
  revalidatePath('/add')
  redirect('/dashboard')
}

export async function deleteTransaction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id') as string

  // Get the transaction first to reverse the balance
  const { data: tx } = await supabase
    .from('transactions')
    .select('amount, type, account_id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (tx) {
    // Reverse the balance change
    const { data: account } = await supabase
      .from('accounts')
      .select('balance')
      .eq('id', tx.account_id)
      .single()

    if (account) {
      const newBalance = tx.type === 'income'
        ? account.balance - tx.amount
        : account.balance + tx.amount

      await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', tx.account_id)
    }

    await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id)
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// ─── GOALS ──────────────────────────────────────────────────

export async function createGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = formData.get('name') as string
  const target_amount = parseFloat(formData.get('target_amount') as string)
  const deadline = formData.get('deadline') as string || null

  const { error } = await supabase.from('goals').insert({
    user_id: user.id,
    name,
    target_amount,
    deadline,
  })

  if (error) {
    return redirect('/goals?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/goals')
  redirect('/goals')
}

export async function addToGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id') as string
  const addAmount = parseFloat(formData.get('amount') as string)

  const { data: goal } = await supabase
    .from('goals')
    .select('current_amount')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (goal) {
    await supabase
      .from('goals')
      .update({ current_amount: goal.current_amount + addAmount })
      .eq('id', id)
  }

  revalidatePath('/goals')
  redirect('/goals')
}

export async function deleteGoal(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id') as string

  await supabase.from('goals').delete().eq('id', id).eq('user_id', user.id)

  revalidatePath('/goals')
  redirect('/goals')
}
