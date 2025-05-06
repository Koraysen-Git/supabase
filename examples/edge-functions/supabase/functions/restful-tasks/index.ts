import axios from 'axios';

const SUPABASE_URL = 'https://qopbtqygpnpibflipvgw.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcGJ0cXlncG5waWJmbGlwdmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODQ2NzksImV4cCI6MjA2MTI2MDY3OX0.JbbzOJp154204mAp1L7SnHAHJQaBVvFCjLKd67PHKKQ';

const WORKER_URL = 'https://api-api-football.korayseninmaili.workers.dev/';

async function fetchAndInsert() {
  try {
    // 1. Cloudflare Worker'dan veriyi al
    const response = await axios.get(WORKER_URL);
    const matches = response.data;

    if (!Array.isArray(matches) || matches.length === 0) {
      console.log('Veri bulunamadı veya boş.');
      return;
    }

    // 2. Her maçı Supabase'e gönder
    for (const match of matches) {
      const payload = {
        fixture: match.fixture,
        home_last_5: match.home_last_5,
        away_last_5: match.away_last_5
      };

      const { data, status } = await axios.post(
        `${SUPABASE_URL}/rest/v1/matches`,
        payload,
        {
          headers: {
            apikey: SUPABASE_API_KEY,
            Authorization: `Bearer ${SUPABASE_API_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          }
        }
      );

      console.log('Supabase kayıt başarılı:', status, data);
    }
  } catch (error) {
    console.error('Hata:', error.response?.data || error.message);
  }
}

fetchAndInsert();
