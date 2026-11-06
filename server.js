import express from "express";

const app = express();
const port = 3000;
const myFriend = [
  { id: "69319010007", name: "องศา" },
  { id: "69319010008", name: "เก้า" },
  { id: "69319010009", name: "ภัทร" },
  { id: "69319010010", name: "ฟรุ๊ต" },
  { id: "69319010011", name: "ธี" },
  { id: "69319010012", name: "ติม" },
  { id: "69319010013", name: "ข้าว" },
  { id: "69319010014", name: "ยูริ" },
  { id: "69319010015", name: "เท็น" },
  { id: "69319010018", name: "โมเดล" },
  { id: "69319010019", name: "ภูมิ" },
  { id: "69319010020", name: "ภู" },
  { id: "69319010022", name: "เป็ก" },
  { id: "69319010023", name: "นาย" },
];

const equipment = [
    {id:1, name:'คอมพิวเตอร์', category:'computer'},
    {id:2, name:'เครื่องพิม', category:'printer'},
    {id:3, name:'คีย์บอร์ด', category:'accessory'},
]

app.get("/api/equipment/:id",(req,res)=>{
    const id = Number(req.params.id);
    const result = equipment.find(e=>e.id==id)
    if (result) {
        res.status(200).json(result)
    } else {
        res.status(404).json({message:"ไม่พบข้อมูล"})
    }
})

app.get("/api/equipment",(req,res) => {
    const cat = req.query.category;
    const result = cat?equipment.filter(e=>e.category===cat):equipment;
    res.status(200).json(result);
})

app.get("/api/equipment/getNum", (req, res) => {
    res.status(200).json({
        num: equipment.length
    });
});

app.get("/",(req,res) => {
    res.send("Hello world print");
})

app.get("/health",(req,res) => {
    res.json(
        {
            status: "OK",
            message: "Loading..."
        }
    )
})

app.get("/Myfriend",(req,res) => {
    res.json(myFriend)
})

app.listen(port, () => {
    console.log(`Server is running 
        on http://localhost:${port}`);
})
