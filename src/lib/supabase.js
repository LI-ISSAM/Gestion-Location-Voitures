import {createClient} from '@supabase/supabase-js';


const SUPABASE_URL ="https://irasjvlfxfudbvfqhkel.supabase.co";
const SUPABASE_ANON_KEY = "sb_secret_xyK1EIhw2z9dCOAVuGokFg_F_-RbCUj";


export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);



