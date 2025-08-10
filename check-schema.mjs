import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("Checking companies table schema...");
    
    // First check if we can query the tags column
    const { data: tagsData, error: tagsError } = await supabase
        .from("companies")
        .select("tags")
        .limit(1);
    
    if (tagsError) {
        console.error("Error querying tags:", tagsError);
        console.log("Attempting to get full table structure...");
        
        // Get the full table structure using a raw query
        const { data, error } = await supabase
            .from("companies")
            .select("*")
            .limit(1);
            
        if (error) {
            console.error("Error getting table structure:", error);
        } else {
            console.log("Table columns:", Object.keys(data[0] || {}));
        }
    } else {
        console.log("Tags column exists. Sample data:", tagsData);
    }
}

checkSchema().catch(console.error);
