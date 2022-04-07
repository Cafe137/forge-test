const { copySync } = require('fs-extra')
const { join } = require('path')

module.exports = {
    postPackage: (_, options) => {
        copySync('static', join(options.outputPaths[0], 'static'))
    }
}
