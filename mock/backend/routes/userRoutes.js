import { Router } from 'express';
const router = Router();



router.get('/get', async (req, res) => {
  console.log("getapi hitted");
  return res.json({success:true})
});

// POST create example
router.post('/post', async (req, res) => {
   console.log("post api hitted");
  return res.json({success:true})
});

export default router;