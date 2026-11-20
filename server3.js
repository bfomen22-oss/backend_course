import express from "express";

const app = express();
const port = 3000;

// Workshop 03: เปิดให้ Express อ่าน JSON จาก Body
app.use(express.json());

// ปรับ id เป็น 101-103 และเพิ่ม quantity ให้ตรงกับตารางทดสอบ (POST แรกจะได้ id 104)
const equipment = [
  { id: 101, name: "คอมพิวเตอร์", category: "computer", quantity: 10 },
  { id: 102, name: "เครื่องพิมพ์", category: "printer", quantity: 5 },
  { id: 103, name: "คีย์บอร์ด", category: "computer", quantity: 20 },
];

// ตัวนับ ID (ไม่ใช้ equipment.length + 1)
let nextId = 104;

// ---------- ฟังก์ชันตรวจข้อมูล ----------
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isValidQuantity(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// ---------- GET /api/equipment (กรองด้วย ?category=) ----------
app.get("/api/equipment", (req, res) => {
  // ถ้ามี category ใน query ต้องเป็นข้อความที่ไม่ว่าง และระบุได้ค่าเดียว
  if ("category" in req.query) {
    const cat = req.query.category;

    if (!isNonEmptyString(cat)) {
      return res.status(400).json({
        message: "category ต้องเป็นข้อความที่ไม่ว่าง และระบุได้ค่าเดียว",
      });
    }

    const wanted = cat.trim().toLowerCase();
    const result = equipment.filter(
      (e) => e.category.toLowerCase() === wanted
    );
    return res.status(200).json(result);
  }

  res.status(200).json(equipment);
});

// ---------- GET /api/equipment/count ----------
// ต้องอยู่ "ก่อน" /:id ไม่เช่นนั้น "count" จะถูกมองเป็น id แล้วได้ 400
app.get("/api/equipment/count", (req, res) => {
  res.status(200).json({ total: equipment.length });
});

// ---------- GET /api/equipment/:id ----------
app.get("/api/equipment/:id", (req, res) => {
  const rawId = req.params.id;

  if (!/^\d+$/.test(rawId)) {
    return res.status(400).json({ message: "id ต้องเป็นจำนวนเต็มบวก" });
  }

  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) {
    return res.status(400).json({ message: "id ต้องเป็นจำนวนเต็มบวก" });
  }

  const result = equipment.find((e) => e.id === id);
  if (!result) {
    return res.status(404).json({ message: "ไม่พบข้อมูล" });
  }

  res.status(200).json(result);
});

// ---------- POST /api/equipment ----------
app.post("/api/equipment", (req, res) => {
  const body = req.body;

  // Express 5: ถ้าไม่ส่ง Body มา req.body จะเป็น undefined
  if (!isPlainObject(body)) {
    return res.status(400).json({ message: "Body ต้องเป็น JSON Object" });
  }

  const { name, category, quantity } = body;

  if (!isNonEmptyString(name)) {
    return res.status(400).json({ message: "name ต้องเป็นข้อความที่ไม่ว่าง" });
  }
  if (!isNonEmptyString(category)) {
    return res
      .status(400)
      .json({ message: "category ต้องเป็นข้อความที่ไม่ว่าง" });
  }
  if (!isValidQuantity(quantity)) {
    return res
      .status(400)
      .json({ message: "quantity ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป" });
  }

  const newItem = {
    id: nextId++,
    name: name.trim(),
    category: category.trim(),
    quantity,
  };

  equipment.push(newItem);
  res.status(201).json(newItem);
});

// ---------- Route เดิม ----------
app.get("/", (req, res) => {
  res.send("Hello world print");
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Loading...",
  });
});

// ---------- Error handler (ต้องอยู่หลัง Route ทั้งหมด ก่อน listen) ----------
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "รูปแบบ JSON ไม่ถูกต้อง" });
  }
  console.error(err);
  res.status(500).json({ message: "เกิดข้อผิดพลาดที่ Server" });
});




app.patch('/api/equipment/:id', (req,res)=>{
  const id = Number(req.params.id)

  if(isNaN(id)){
    return res.status(400).json({
      message: "ต้องระบุ ID ที่จะแก้ไข"
    })
  }

  const item = equipment.find(e=>e.id===id)

  if(!item){
    return res.status(404).json({
      message: "ไม่พบข้อมูลที่ต้องการแก้ไข"
    })
  }

  const body = req.body

  if(body &&
    Object.hasOwn(body,'name') &&
    Object.hasOwn(body,'quantity') &&
    Object.hasOwn(body,'category')){

      item.name = body.name.trim();
      item.quantity = body.quantity;
      item.category = body.category.trim();

      return res.status(200).json({
        message: "แก้ไขข้อมูลแล้ว",
        data: item
      })

  }else{
    return res.status(400).json({
      message: "ข้อมูลไม่ครบ"
    })
  }

})


app.delete('/api/equipment/:id', (req,res)=>{
  const id = Number(req.params.id)

  if(id===null){
    return res.status(400).json({
      message: "กรุณาตรวจสอบ ID ที่ต้องการลบ"
    })
  }

  const index = equipment.findIndex(e=>e.id===id)

  if(index===-1){
    return res.status(404).json({
      message: "ไม่พบ ID ที่ต้องการลบ"
    })
  }

  const [deleted] = equipment.splice(index,1)

  res.status(200).json({
    message: "ลบข้อมูลอุปกรณ์แล้ว"
  })
})



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});