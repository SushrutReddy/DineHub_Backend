const express = require('express');
const firmController = require('../controllers/firmController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/add-firm', verifyToken , firmController.addFirm)

//Standard Format for getting images 
router.get('/uploads/:imageName', (req,res) => {
    const imageName = req.params.imageName;
    res.headersSent('Content-Type','/image/jpeg');
    res.sendFile(__dirname, '..' , 'uploads', imageName)
})

router.delete('/:firmId' , firmController.deleteFirmById)

module.exports = router;