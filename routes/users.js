const { Router } = require("express");
const { getUser,
        putUser,
        postUser,
        deleteUser } = require("../controllers/users");
        
const router = Router();

router.get("/:id", getUser);

router.put("/:id", putUser);

router.post("/", postUser);

router.delete("/", deleteUser);

module.exports = router;
