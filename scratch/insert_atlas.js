const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = "https://xokthiwaizpuklcsndtw.supabase.co";
const SUPABASE_KEY = "sb_publishable_S92XME4HdswGFVad0lpT7w__GeR1cBC";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  const logoPath = path.join(__dirname, '../src/assets/logo-atlas.png');
  let logoDataUrl = null;
  if (fs.existsSync(logoPath)) {
    const buffer = fs.readFileSync(logoPath);
    logoDataUrl = `data:image/png;base64,${buffer.toString('base64')}`;
  }

  // Check if Atlas brand already exists
  const { data: existing } = await supabase.from('brands').select('*').or('name.eq.Atlas,name.eq.أطلس,slug.eq.atlas');
  
  if (existing && existing.length > 0) {
    console.log("Atlas brand already exists:", existing[0]);
    // Update logo if needed
    const { error } = await supabase.from('brands').update({
      name: "أطلس (Atlas)",
      logo: logoDataUrl || existing[0].logo
    }).eq('id', existing[0].id);
    if (error) console.error("Error updating Atlas:", error);
    else console.log("Atlas brand updated successfully!");
  } else {
    // Insert new brand
    const { data, error } = await supabase.from('brands').insert({
      name: "أطلس (Atlas)",
      slug: "atlas",
      logo: logoDataUrl
    }).select('*');
    if (error) {
      console.error("Error inserting Atlas:", error);
    } else {
      console.log("Atlas brand inserted successfully:", data);
    }
  }
}

run();
