const express = require("express");
const fs = require("fs/promises");

const PORT = 80;
const resPath = 'static/res';

let app = express();

app.use(express.static("static"));

app.get("/images.json", async (req, res, next) => {
    let dirents = await fs.readdir(resPath);
    let json = [];

    await Promise.all(dirents.map(async dirent => {
        let direntPath = `${resPath}/${dirent}`;
        let stat = await fs.stat(direntPath);

        if (stat.isDirectory()) {
            let images = [];
            
            let imagesDirents = await fs.readdir(direntPath);
            await Promise.all(imagesDirents.map(async imageDirent => {
                let stat = await fs.stat(`${direntPath}/${imageDirent}`);
                if (stat.isFile() && imageDirent.endsWith('.png')) {
                    let index = parseInt(imageDirent) - 1;
                    images[index] = `/res/${dirent}/${imageDirent}`;
                }
            }));

            json.push(images);
        }
    }));

    res.status(200).json(json).send();
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}/`);
});