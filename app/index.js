const ShellSpawn = require('./lib/ShellSpawn')
const ShellExec = require('./lib/ShellExec')
const GetFiles = require('./lib/GetFiles')

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
  let files = GetFiles()
  for (let i = 0; i < files.length; i++) {
    let file = files[i]
    
    let filename = path.basename(file)
    let dirname = path.dirname(file)
    let filenameNoExt = path.parse(filename).name
    let ext = path.extname(filename)
    if (ext !== '.pdf') {
      continue
    }


    let cropPDFfile = dirname + '/' + filenameNoExt + '-crop.pdf'
    await ShellExec(`pdfcrop "${file}" "${cropPDFfile}"`)

    dirname = '/output'
    let cropSVGfile = dirname + '/' + filenameNoExt + '-crop.svg'
    await ShellExec(`inkscape --pdf-poppler --export-page=1 --export-type=svg --export-text-to-path --export-area-drawing --export-filename "${cropSVGfile}" "${cropPDFfile}"`)

    RemoveSVGBackground(cropSVGfile)
    await ShellExec(`rm -f "${cropPDFfile}"`)

    let cropPNGfile = dirname + '/' + filenameNoExt + '-crop.png'
    await ShellExec(`inkscape --export-png="${cropPNGfile}" "${cropSVGfile}" --export-dpi=300`)

    let cropEMFfile = dirname + '/' + filenameNoExt + '-crop.emf'
    await ShellExec(`inkscape --export-emf="${cropEMFfile}" "${cropSVGfile}"`)
  }
}

main()