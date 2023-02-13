const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetExistedArgv = require('./lib/GetExistedArgv')

const path = require('path')
const fs = require('fs')

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

// convert a.tif -thumbnail 64x64^ -gravity center -extent 64x64 b.ico

let RemoveSVGBackground = function(file) {
  let content = fs.readFileSync(file, 'utf8')

  // let pos1 = content.indexOf(`<path fill="#000000" d="`)
  // let footer = `" fill-rule="evenodd"/>`
  // let pos2 = content.indexOf(footer, pos1)

  // console.log(pos1, pos2)
  // content = content.slice(0, pos1) + content.slice(pos2 + footer.length)

  let xmlObject = $(`<div>` + content + `</div>`)
  // console.log(xmlObject.find('path[fill="#ffffff"][d][fill-rule="evenodd"]:first').length)
  xmlObject.find('path[fill="#ffffff"][d][fill-rule="evenodd"]:first').remove()

  // console.log(xmlObject.html())
  fs.writeFileSync(file, xmlObject.html(), 'utf8')
}

let main = async function () {
  let files = GetExistedArgv()
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    
    let filename = path.basename(file)
    let dirname = path.dirname(file)
    let filenameNoExt = path.parse(filename).name
    let ext = path.extname(filename)
    if (ext !== '.svg') {
      continue
    }

    let tmpFile = `${dirname}/tmp-trim.svg`
    let emfFile = `${dirname}/tmp-trim.emf`
    await ShellExec(`cp -f "${file}" "${tmpFile}"`)
    RemoveSVGBackground(tmpFile)

    // await ShellExec(`inkscape --batch-process --actions="fitCanvasToDrawing;export-filename:tmp-trim-b.svg;export-do;" "${tmpFile}"`)

    // await ShellExec(`inkscape --verb=FitCanvasToDrawing --verb=FileSave --verb=FileQuit "${tmpFile}"`)

    // await ShellExec(`inkscape --batch-process --actions="export-area-drawing;export-filename:tmp-trim-b.svg;export-do;" "${tmpFile}"`)

    // await ShellExec(`inkscape --file "${tmpFile}" --export-emf "${emfFile}"`)

    await ShellExec(`inkscape --actions="export-filename:tmptrimb.emf;export-do;" "${tmpFile}"`)

    // await ShellExec(`convert "${file}" -trim +repage "${path.resolve(dirname, filenameNoExt + '-cropped.' +ext)}"`)
    // await ShellExec(`convert "${file}" -transparent white -trim +repage "${path.resolve(dirname, filenameNoExt + '-cropped.' +ext)}"`)
    // await ShellExec(`convert "${file}"  -alpha set -bordercolor white -border 1 -fill none -fuzz 3% -draw "color 0,0 floodfill" -shave 1x1 -trim +repage "${path.resolve(dirname, filenameNoExt + '-cropped' +ext)}"`)
    // convert -gravity center "c.png" -flatten -fuzz 1% -trim +repage -resize 64x64 -extent 64x64 "b.ico"

    // console.log(file)

    
  }
}

main()