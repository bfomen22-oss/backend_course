import express from "express";

const app = express();
const port = 3000;
app.use(express.json());

// ข้อมูลนักศึกษา (เก็บในหน่วยความจำ)
let students = [
  { stdID: "69319010007", stdName: "นาย กฤษดา บุญเหลือ" },
  { stdID: "69319010008", stdName: "นาย ญาณวุฒิ จันเพ็ง" },
  { stdID: "69319010009", stdName: "นาย ณภัทร โสธรรมมงคล" },
  { stdID: "69319010010", stdName: "นาย ธนดล คล้ายรัศมี" },
  { stdID: "69319010011", stdName: "นาย ธีทัต จันทร์สว่าง" },
  { stdID: "69319010012", stdName: "นาย นัฐพนธ์ ใจเย็น" },
  { stdID: "69319010013", stdName: "นาย ปกรณ์เกียรติ อยู่พิทักษ์สกุล" },
  { stdID: "69319010014", stdName: "นาย ปฏิพล เรืองชัย" },
  { stdID: "69319010015", stdName: "นาย ปิยะพงษ์ เหล่าประชาวิทย์" },
  { stdID: "69319010018", stdName: "นางสาว ภัทราวรินทร์ ศรีน้อย  " },
  { stdID: "69319010019", stdName: "นาย ภูริพัฒน์ สุธรรมมา" },
  { stdID: "69319010020", stdName: "นาย ภูวดล พลจารย์" },
  { stdID: "69319010022", stdName: "นาย ศาศวัต แสงคําฉาย" },
  { stdID: "69319010023", stdName: "นาย อภิรักษ ศรีวัดทานัง"}
];

// ---------- CREATE : เพิ่มนักศึกษา ----------
app.post('/students', (req, res) => {
  const { stdID, stdName } = req.body || {};

  if (!stdID || !stdName) {
    return res.status(400).json({ message: 'ต้องระบุ stdID และ stdName' });
  }
  if (students.some((s) => s.stdID === String(stdID))) {
    return res.status(409).json({ message: 'รหัสนักศึกษานี้มีอยู่แล้ว' });
  }

  const newStudent = { stdID: String(stdID), stdName };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// ---------- READ : ดูทั้งหมด ----------
app.get('/students', (req, res) => {
  res.json(students);
});

// ---------- READ : ดูรายคนตามรหัส ----------
app.get('/students/:stdID', (req, res) => {
  const student = students.find((s) => s.stdID === req.params.stdID);
  if (!student) {
    return res.status(404).json({ message: 'ไม่พบนักศึกษา' });
  }
  res.json(student);
});

// ---------- UPDATE : แก้ไขบางส่วน (PATCH) ----------
app.patch('/students/:stdID', (req, res) => {
  const student = students.find((s) => s.stdID === req.params.stdID);
  if (!student) {
    return res.status(404).json({ message: 'ไม่พบนักศึกษา' });
  }

  const { stdName } = req.body || {};
  if (stdName === undefined || stdName === '') {
    return res.status(400).json({ message: 'ต้องระบุ stdName ที่ต้องการแก้ไข' });
  }

  student.stdName = stdName;
  res.json(student);
});

// ---------- DELETE : ลบนักศึกษา ----------
app.delete('/students/:stdID', (req, res) => {
  const index = students.findIndex((s) => s.stdID === req.params.stdID);
  if (index === -1) {
    return res.status(404).json({ message: 'ไม่พบนักศึกษา' });
  }

  const deleted = students.splice(index, 1)[0];
  res.json({ message: 'ลบสำเร็จ', deleted });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});