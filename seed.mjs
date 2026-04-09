import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const res = await fetch('https://usaibrahimalqurashi.com/products.json?limit=10')
  const data = await res.json()
  
  const products = data.products.map(p => ({
    title: p.title,
    slug: p.handle,
    content: p.body_html ? p.body_html.replace(/<[^>]+>/g, '') : '',
    topic: p.product_type || 'Fragrance',
    image_url: p.images && p.images[0] ? p.images[0].src : null
  }))

  const { data: insertedData, error } = await supabase
    .from('posts')
    .insert(products)

  if (error) {
    console.error('Error inserting data:', error)
  } else {
    console.log('Successfully inserted data:', products.length, 'products')
  }
}

run()
