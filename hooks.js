const { zipSync, unzipSync } = require('cross-zip')
const { copySync, mkdirSync, existsSync } = require('fs-extra')
const { join } = require('path')

module.exports = {
    postMake: (_, makeResults) => {
        const [makeResult] = makeResults
        const dirName = `${makeResult.packageJSON.name}-${makeResult.platform}-${makeResult.arch}-${makeResult.packageJSON.version}`
        const name = `${dirName}.zip`
        if (!existsSync(dirName)) {
            mkdirSync(dirName)
        }
        copySync('static', dirName)
        if (makeResult.artifacts[0].endsWith('.zip')) {
            unzipSync(makeResult.artifacts[0], dirName)
        } else {
            copySync(makeResult.artifacts[0], dirName)
        }
        zipSync(dirName, name)
        return [
            {
                packageJSON: makeResult.packageJSON,
                artifacts: [join(__dirname, name)],
                platform: makeResult.platform,
                arch: makeResult.arch
            }
        ]
    }
}
