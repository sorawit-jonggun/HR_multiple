# hr-backend-api — API toggle

คำอธิบาย
--
ไฟล์นี้อธิบายวิธีปิดการใช้งาน API ชั่วคราวโดยไม่ต้องลบโค้ด: ตั้งตัวแปรแวดล้อม `DISABLE_API=true` แล้วเซิร์ฟเวอร์จะบล็อกทุกเส้นทางที่ขึ้นต้นด้วย `/api` และคืนค่า `410 Gone` แทนการเรียก controllers ปกติ

วิธีใช้งาน (Windows PowerShell)
--
เปิดการบล็อก (คืนค่า 410):

```powershell
$env:DISABLE_API='true'
node server.js
```

ปิดการบล็อก (API ทำงานตามปกติ):

```powershell
Remove-Item Env:DISABLE_API
node server.js
```

วิธีใช้งาน (bash / macOS / Linux)
--
เปิดการบล็อก:

```bash
DISABLE_API=true node server.js
```

ปิดการบล็อก:

```bash
unset DISABLE_API
node server.js
```

การปรับแต่งเพิ่มเติม
--
- หากต้องการเปลี่ยนสถานะการคืนค่าเป็น `403 Forbidden` หรือ `404 Not Found` ให้แก้บรรทัดที่คืนค่าจาก `res.status(410)...` ใน `server.js` เป็นรหัสที่ต้องการ
- หากต้องการบล็อกเฉพาะบางพาธ ให้แก้เงื่อนไขหรือเพิ่ม middleware ก่อนการ mount ของ route ที่ต้องการ

หมายเหตุ
--
การตั้งค่านี้เป็นชั่วคราวและง่ายต่อการย้อนกลับ — เหมาะสำหรับ maintenance window หรือการปิดบริการชั่วคราวโดยไม่ต้องลบโค้ด
