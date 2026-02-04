# backend/app/seed_demo_real.py
import requests
import time

BASE_URL = "http://127.0.0.1:8000"  # backend URL
VERIFY_PATH = "/api/v1/verify-name"           # <-- we will update this after Step 1 if needed

# 15+ multilingual inputs (ONLY inputs; outputs come from your real pipeline)
DEMO_INPUTS = [
    
    {"full_name": "Mahinda Rajapaksa", "country": "LK", "top_k": 5},
{"full_name": "Mahinda Rajapakshe", "country": "LK", "top_k": 5},
{"full_name": "Mahinda Rajapaksha", "country": "LK", "top_k": 5},
{"full_name": "M. Rajapaksa", "country": "LK", "top_k": 5},
{"full_name": "Mahinda R. Rajapaksa", "country": "LK", "top_k": 5},
{"full_name": "මහින්ද රාජපක්ෂ", "country": "LK", "top_k": 5},
{"full_name": "මහින්ද රාජපක්ෂේ", "country": "LK", "top_k": 5},
{"full_name": "அருண் குமார்", "country": "LK", "top_k": 5},
{"full_name": "Arun Kumar", "country": "LK", "top_k": 5},
{"full_name": "A. Kumar", "country": "LK", "top_k": 5},
{"full_name": "Arun K.", "country": "LK", "top_k": 5},
{"full_name": "Алексей Смирнов", "country": "RU", "top_k": 5},
{"full_name": "Aleksei Smirnov", "country": "RU", "top_k": 5},
{"full_name": "Alexey Smirnov", "country": "RU", "top_k": 5},
{"full_name": "A. Smirnov", "country": "RU", "top_k": 5},
{"full_name": "François L'Écuyer", "country": "FR", "top_k": 5},
{"full_name": "Francois Lecuyer", "country": "FR", "top_k": 5},
{"full_name": "F. Lecuyer", "country": "FR", "top_k": 5},
{"full_name": "Li Wei", "country": "CN", "top_k": 5},
{"full_name": "Wei Li", "country": "CN", "top_k": 5},
{"full_name": "W. Li", "country": "CN", "top_k": 5},
{"full_name": "Ivan Petrov", "country": "RU", "top_k": 5},
{"full_name": "Petrov Ivan", "country": "RU", "top_k": 5},
{"full_name": "ශිරන්ති රාජපක්ෂ", "country": "LK", "top_k": 5},
{"full_name": "அருண் குமார்", "country": "IN", "top_k": 5},
{"full_name": "محمد عبد الله", "country": "SA", "top_k": 5},
{"full_name": "أحمد ناصر", "country": "IR", "top_k": 5},
{"full_name": "Алексей Смирнов", "country": "RU", "top_k": 5},
{"full_name": "张伟", "country": "CN", "top_k": 5},
{"full_name": "Zhang Wei", "country": "CN", "top_k": 5},
{"full_name": "佐藤健", "country": "JP", "top_k": 5},
{"full_name": "김민수", "country": "KR", "top_k": 5},
{"full_name": "राहुल शर्मा", "country": "IN", "top_k": 5},
{"full_name": "สมชาย ใจดี", "country": "TH", "top_k": 5},
{"full_name": "Γεώργιος Παπαδόπουλος", "country": "GR", "top_k": 5},
{"full_name": "דוד לוי", "country": "IL", "top_k": 5},
{"full_name": "François L'Écuyer", "country": "FR", "top_k": 5},
{"full_name": "Michael Johnson", "country": "US", "top_k": 10},
{"full_name": "Oleg Ivanov", "country": "RU", "top_k": 5},
    
]

def main():
    url = f"{BASE_URL}{VERIFY_PATH}"

    ok = 0
    fail = 0

    for i, payload in enumerate(DEMO_INPUTS, start=1):
        try:
            r = requests.post(url, json=payload, timeout=120)
            if r.status_code >= 200 and r.status_code < 300:
                ok += 1
                data = r.json()
                # print a small summary (real output)
                decision = data.get("decision")
                risk = data.get("risk_level")
                hits = len(data.get("top_hits", []) or [])
                print(f"[{i:02}] OK  {payload['full_name']}  -> decision={decision}, risk={risk}, hits={hits}")
            else:
                fail += 1
                print(f"[{i:02}] FAIL {payload['full_name']}  -> {r.status_code}: {r.text[:200]}")
        except Exception as e:
            fail += 1
            print(f"[{i:02}] ERROR {payload['full_name']} -> {e}")

        time.sleep(0.2)  # tiny pause so you don't hammer the server

    print(f"\nDone. success={ok}, failed={fail}")

if __name__ == "__main__":
    main()