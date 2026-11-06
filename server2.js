import express from "express";

const app = express();

app.use(express.json());

// 1) [GET] /api/health  -> ตรวจสอบการทำงานของเซิร์ฟเวอร์
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    uptime_seconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// 2) [GET] /api/formula1?a=1&b=-3&c=2
//    สูตรกำลังสอง: ax^2 + bx + c = 0  ->  x = (-b ± √(b² - 4ac)) / 2a
//    (ระดับ ม.ปลาย) ส่งพารามิเตอร์แบบ query: a, b, c
app.get("/api/formula1", (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  const c = Number(req.query.c);

  if ([req.query.a, req.query.b, req.query.c].some((v) => v === undefined || v === "")) {
    return res.status(400).json({ error: "ต้องส่ง query a, b, c ให้ครบ เช่น ?a=1&b=-3&c=2" });
  }
  if (![a, b, c].every(Number.isFinite)) {
    return res.status(400).json({ error: "a, b, c ต้องเป็นตัวเลข" });
  }
  if (a === 0) {
    return res.status(400).json({ error: "a ต้องไม่เท่ากับ 0 (ไม่เช่นนั้นไม่ใช่สมการกำลังสอง)" });
  }

  const discriminant = b * b - 4 * a * c; // D = b² - 4ac
  const result = {
    formula: "x = (-b ± √(b² - 4ac)) / 2a",
    equation: `${a}x² + ${b}x + ${c} = 0`,
    input: { a, b, c },
    discriminant,
  };

  if (discriminant > 0) {
    result.type = "two real roots";
    result.roots = [
      (-b + Math.sqrt(discriminant)) / (2 * a),
      (-b - Math.sqrt(discriminant)) / (2 * a),
    ];
  } else if (discriminant === 0) {
    result.type = "one repeated real root";
    result.roots = [-b / (2 * a)];
  } else {
    // D < 0 -> รากเป็นจำนวนเชิงซ้อน
    const real = -b / (2 * a);
    const imag = Math.sqrt(-discriminant) / (2 * Math.abs(a));
    result.type = "two complex roots";
    result.roots = [
      { real, imaginary: imag },
      { real, imaginary: -imag },
    ];
  }

  res.status(200).json(result);
});

// 3) [GET] /api/formula2/:n/:r
//    การจัดหมู่และการเรียงสับเปลี่ยน (ระดับ ม.ปลาย-มหาวิทยาลัย)
//      C(n, r) = n! / (r! (n - r)!)
//      P(n, r) = n! / (n - r)!
//    ส่งพารามิเตอร์แบบ path: n, r  เช่น /api/formula2/10/3
app.get("/api/formula2/:n/:r", (req, res) => {
  const n = Number(req.params.n);
  const r = Number(req.params.r);

  if (!Number.isInteger(n) || !Number.isInteger(r)) {
    return res.status(400).json({ error: "n และ r ต้องเป็นจำนวนเต็ม" });
  }
  if (n < 0 || r < 0 || r > n) {
    return res.status(400).json({ error: "ต้องมี 0 ≤ r ≤ n" });
  }
  if (n > 500) {
    return res.status(400).json({ error: "n ต้องไม่เกิน 500" });
  }

  // ใช้ BigInt เพื่อให้ได้ค่าที่แม่นยำแม้ตัวเลขใหญ่
  let permutation = 1n; // P(n, r) = n × (n-1) × ... × (n-r+1)
  for (let i = 0n; i < BigInt(r); i++) {
    permutation *= BigInt(n) - i;
  }
  let factorialR = 1n; // r!
  for (let i = 2n; i <= BigInt(r); i++) {
    factorialR *= i;
  }
  const combination = permutation / factorialR; // C(n, r) = P(n, r) / r!

  res.status(200).json({
    formula: "C(n,r) = n!/(r!(n-r)!), P(n,r) = n!/(n-r)!",
    input: { n, r },
    combination: combination.toString(),
    permutation: permutation.toString(),
  });
});

// เส้นทางที่ไม่มีอยู่
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});