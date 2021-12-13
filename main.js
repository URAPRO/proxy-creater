'use strict';

let fs = require('fs');
const {createCanvas, loadImage} = require('canvas')
async function WriteImage() {
    let imgDirName = __dirname + '/img/'
    let outputDirName = __dirname + '/output/'
    if (isExistFile(outputDirName)) {
        fs.rmSync(outputDirName, {recursive: true})
    }
    fs.mkdirSync('output');

    let cardfilePath = fs.readdirSync(imgDirName).map(cardName => imgDirName + cardName);
    // pngのみを対象にする
    let cardImagePath = cardfilePath.filter(function(path){
       return path.split('.').pop() == 'png'
    });
    let numOfSheets = Math.ceil(cardImagePath.length / 8);

    for (let i = 0; i < numOfSheets; i++) {
        const templateWidth = 3508
        const templateHeight = 2479
        const canvas = createCanvas(templateWidth, templateHeight)
        let ctx = canvas.getContext('2d');
        // 透明画像になってしまうので、ベースにテンプレを書き出す
        await loadImage('CGC_template.png').then((image) => {
            ctx.drawImage(image, 0, 0)
        })
        for (let j = 0; j < Math.min(cardImagePath.length - 8 * i, 8); j++) {
            await loadImage(cardImagePath[8 * i + j]).then((image) => {
                switch (j % 8) {
                    // テンプレ画像のカードの位置に合わせて決め打ち
                    case 0:
                        ctx.drawImage(image, 141, 141, 745, 1040);
                        break;
                    case 1 :
                        ctx.drawImage(image, 141, 1299, 745, 1040)
                        break;
                    case 2 :
                        ctx.drawImage(image, 968, 141, 745, 1040)
                        break;
                    case 3 :
                        ctx.drawImage(image, 968, 1299, 745, 1040)
                        break;
                    case 4 :
                        ctx.drawImage(image, 1795, 141, 745, 1040)
                        break;
                    case 5 :
                        ctx.drawImage(image, 1795, 1299, 745, 1040)
                        break;
                    case 6 :
                        ctx.drawImage(image, 2622, 141, 745, 1040)
                        break;
                    case 7 :
                        ctx.drawImage(image, 2622, 1299, 745, 1040)
                }
            })
        }
        // 1シートごとに書き出す
        canvas.toBuffer((err, buf) => {
            fs.writeFileSync("output/image" + i + ".png", buf);
        })
    }
}

function isExistFile(file) {
    try {
        fs.statSync(file);
        return true
    } catch (err) {
        if (err.code === 'ENOENT') return false
    }
}

WriteImage()