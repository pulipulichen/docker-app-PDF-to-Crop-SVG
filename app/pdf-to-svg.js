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
  // xmlObject.find('path[fill="#ffffff"][d][fill-rule="evenodd"]:first').remove()
  xmlObject.find('rect[style="fill:#ffffff;fill-opacity:1;stroke:none"]:first').remove()

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
    if (ext !== '.pdf') {
      continue
    }

    // let tmpFile = `/tmp/tmp-trim.svg`
    // // let emfFile = `${dirname}/tmp-trim.emf`
    // await ShellExec(`cp -f "${file}" "${tmpFile}"`)
    // RemoveSVGBackground(tmpFile)

    // await ShellExec(`inkscape --batch-process --actions="FitCanvasToDrawing;export-filename:/tmp/tmp-trim-b.svg;export-do;" /tmp/tmp-trim.svg`)

    // await ShellExec(`inkscape --verb=FitCanvasToDrawing --verb=FileSave --verb=FileQuit "${tmpFile}"`)

    // await ShellExec(`inkscape --batch-process --actions="export-area-drawing;export-filename:tmp-trim-b.svg;export-do;" "${tmpFile}"`)

    // await ShellExec(`inkscape --file "${tmpFile}" --export-emf "${emfFile}"`)
    // await ShellExec(`inkscape --without-gui --export-emf=/tmp/tmp-trim.emf /tmp/tmp-trim-b.svg`)

    // await ShellExec(`rm -f "/tmp/tmp-trim.svg"`)
    // await ShellExec(`mv "/tmp/tmp-trim-b.svg" "${dirname}/${filenameNoExt}-trim.svg"`)
    // await ShellExec(`mv "/tmp/tmp-trim.emf" "${dirname}/${filenameNoExt}-trim.emf"`)

    // await ShellExec(`inkscape --batch-process --actions="export-filename:tmptrimb.emf;export-do;" "${tmpFile}"`)

    // await ShellExec(`convert "${file}" -trim +repage "${path.resolve(dirname, filenameNoExt + '-cropped.' +ext)}"`)
    // await ShellExec(`convert "${file}" -transparent white -trim +repage "${path.resolve(dirname, filenameNoExt + '-cropped.' +ext)}"`)
    // await ShellExec(`convert "${file}"  -alpha set -bordercolor white -border 1 -fill none -fuzz 3% -draw "color 0,0 floodfill" -shave 1x1 -trim +repage "${path.resolve(dirname, filenameNoExt + '-cropped' +ext)}"`)
    // convert -gravity center "c.png" -flatten -fuzz 1% -trim +repage -resize 64x64 -extent 64x64 "b.ico"

    // console.log(file)

    let cropPDFfile = dirname + '/' + filenameNoExt + '-crop.pdf'
    // console.log(`pdfcrop "${file}" "${cropPDFfile}"`)
    await ShellExec(`pdfcrop "${file}" "${cropPDFfile}"`)

    let cropSVGfile = dirname + '/' + filenameNoExt + '-crop.svg'
    // console.log(`inkscape --pdf-poppler --pdf-page=1 --export-type=svg --export-text-to-path --export-area-drawing --export-filename "${cropSVGfile}" "${cropPDFfile}"`)
    await ShellExec(`inkscape --pdf-poppler --pdf-page=1 --export-type=svg --export-text-to-path --export-area-drawing --export-filename "${cropSVGfile}" "${cropPDFfile}"`)

    RemoveSVGBackground(cropSVGfile)
    await ShellExec(`rm -f "${cropPDFfile}"`)

    let cropPNGfile = dirname + '/' + filenameNoExt + '-crop.png'
    await ShellExec(`inkscape --export-png="${cropPNGfile}" "${cropSVGfile}" --export-dpi=300`)

    let cropEMFfile = dirname + '/' + filenameNoExt + '-crop.emf'
    await ShellExec(`inkscape --export-emf="${cropEMFfile}" "${cropSVGfile}"`)
  }
}

main()