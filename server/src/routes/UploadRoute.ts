import Express from "express";
import multer from "multer"; // 参考官方文档写代码
import path from "path";
import { ResponseHelper } from "./ResponseHelper";
const router = Express.Router();

// 文件保存的配置
const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "../../public/upload"), // 保存的目录
  filename(req, file, cb) {
    // 文件名是啥
    const time = new Date().getTime(); // 保证文件名不重复
    // 后缀名是啥
    const extname = path.extname(file.originalname);
    // 设置文件的全称
    cb(null, `${time}${extname}`);
  },
});
const allowedExtensions = [".jpg", ".png", ".gif", ".bmp", ".jiff"];
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024, // 文件最多1M
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname);
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("文件类型不正确"), false);
    }
  },
}).single("imgfile");

router.post("/", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      ResponseHelper.sendError(err.message, res);
    } else {
      // 一切都好
      const url = `/upload/${req.file.filename}`;
      ResponseHelper.sendData(url, res);
    }
  });
});

export default router;
