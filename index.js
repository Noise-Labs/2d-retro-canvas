export default function Convert(canvasID,boxSize) {
    var canvas = document.querySelector("#" + canvasID)
    var ctx = canvas.getContext("2d")
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    var opts = {
        width:canvas.width,
        height:canvas.height,
        bitSize:boxSize
    }
    console.log(opts)
    convert(ctx,opts);
}

function convert(ctx,opts) {
    var w = opts.width
    var h = opts.height
    var bitSize = opts.bitSize || 2;
    var arrayData = ctx.getImageData(0, 0, w, h);
    var data = arrayData.data
    var parsed = [];
    var l = 0;
    for(var i = 0;i<data.length;i += w *4) {
        for(var j=0;j<h*4;j++) {
            if(!  parsed[l]) {
                parsed[l] = [];
            }
            parsed[l][j] = data[i + j]
        }
        l++
    }
    for(var i=0;i<parsed.length;i += bitSize) {
        for (var j=0;j<parsed[i].length;j += bitSize*4) {
            var totals = [0,0,0,0];
            for(var m=0;m<bitSize;m++) {
                for(var n=0;n<bitSize;n++) {
                    totals[0] += parsed[i + m][j + n*4]
                    totals[1] += parsed[i + m][j + n*4+1]
                    totals[2] += parsed[i + m][j + n*4+2]
                    totals[3] += parsed[i + m][j + n*4+3]
                }
            }
            for(var m=0;m<bitSize;m++) {
                for (var n = 0; n < bitSize; n++) {
                    parsed[i +m][j+n*4] = totals[0] / (bitSize*bitSize)
                    parsed[i +m][j+n*4 +1] = totals[1] / (bitSize*bitSize)
                    parsed[i +m][j+n*4 +2] = totals[2] / (bitSize*bitSize)
                    parsed[i +m][j+n*4 + 3] = totals[3] / (bitSize*bitSize)
                }
            }
        }

    }
    for(var i=0;i<parsed.length;i += 1) {
        for (var j=0;j<parsed[i].length;j += 1) {
            data[w*4*i + j] = parsed[i][j]
        }
    }

    ctx.putImageData(arrayData, 0, 0);
}