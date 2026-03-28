# วิธีรันโปรเจค

## ทำงานเอง (localhost)
Terminal 1: cd C:\cwie\Backend\cwie-backend && python -m uvicorn app.main:app --reload --port 8000
Terminal 2: cd C:\cwie\Frontend && npm run dev

## ให้เพื่อนลอง (cloudflare tunnel)
Terminal 1: cd C:\cwie\Backend\cwie-backend && python -m uvicorn app.main:app --reload --port 8000
Terminal 2: cd C:\cwie\Frontend && npx vite --host 0.0.0.0 --port 5173
Terminal 3: C:\cwie\cloudflared-windows-amd64.exe tunnel --url http://localhost:8000
Terminal 4: C:\cwie\cloudflared-windows-amd64.exe tunnel --url http://localhost:5173
แล้วแก้ .env ให้ VITE_API_URL ชี้ไป URL backend จาก Terminal 3

## รันคำสั่ง ขึ้น git
# Frontend
cd C:\cwie\Frontend
git checkout -b develop
git push -u origin develop

# Backend
cd C:\cwie\Backend\cwie-backend
git checkout -b develop
git push -u origin develop

## คำสั่ง รันเซิฟ
VITE_API_URL=https://rows-minimum-navy-measured.trycloudflare.com/api/v1
VITE_API_URL=http://localhost:8000/api/v1