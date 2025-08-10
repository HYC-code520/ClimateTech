const { supabase } = require('./server/db/supabase');

async function checkSchema() {
    const { data, error } = await supabase
        .from('companies')
        .select('tags')
        .limit(1);
    
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Data:', data);
    }
}

checkSchema();
