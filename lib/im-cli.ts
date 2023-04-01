#!/usr/bin/env node

import fs from "fs"
import axios from "axios"
import ora from "ora"

const [command, ...packageArgs] = process.argv.slice(2)
const importMapFile = "im.json"

type ImportMap = {
  imports: { [key: string]: string }
}

async function getPackageUrl(packageName: string): Promise<string | null> {
  try {
    const response = await axios.head(`https://esm.sh/${packageName}`)
    return response.request.res.responseUrl
  } catch (error) {
    return null
  }
}

async function addOrUpdatePackage(
  packageNames: string[],
  update = false
): Promise<void> {
  for (const packageName of packageNames) {
    const spinner = ora("Checking package on esm.sh...").start()
    const packageUrl = await getPackageUrl(packageName)

    if (!packageUrl) {
      spinner.fail(`Package ${packageName} not found on esm.sh.`)
      return
    }

    const importMap: ImportMap = fs.existsSync(importMapFile)
      ? JSON.parse(fs.readFileSync(importMapFile, "utf8"))
      : { imports: {} }

    if (update && !importMap.imports[packageName]) {
      spinner.fail(`Package ${packageName} not found in im.json.`)
      return
    }

    importMap.imports[packageName.split("@")[0]] = packageUrl
    fs.writeFileSync(importMapFile, JSON.stringify(importMap, null, 2))

    const action = update ? "updated" : "added"
    spinner.succeed(`Package ${packageName} ${action} to im.json`)
  }
}

function removePackage(packageNames: string[]): void {
  for (const packageName of packageNames) {
    if (!fs.existsSync(importMapFile)) {
      console.error("im.json file not found.")
      return
    }

    const fileContent = fs.readFileSync(importMapFile, "utf8")
    const importMap = JSON.parse(fileContent)

    if (!importMap.imports[packageName]) {
      console.error(`Package ${packageName} not found in im.json.`)
      return
    }

    delete importMap.imports[packageName]
    fs.writeFileSync(importMapFile, JSON.stringify(importMap, null, 2))
    console.log(`Package ${packageName} removed from im.json`)
  }
}

function displayHelp(): void {
  console.log("Usage:")
  console.log(
    "  im add <package-name>[@<version>]    Add a package to the import map"
  )
  console.log(
    "  im update <package-name>             Update a package in the import map"
  )
  console.log(
    "  im remove <package-name>             Remove a package from the import map"
  )
  console.log(
    "  im help                              Display this help message"
  )
}

;(async () => {
  switch (command) {
    case "add":
      if (packageArgs?.length) {
        await addOrUpdatePackage(packageArgs)
      }
      break
    case "update":
      if (packageArgs?.length) {
        await addOrUpdatePackage(packageArgs, true)
      }
      break
    case "remove":
      if (packageArgs?.length) {
        removePackage(packageArgs)
      }
      break
    case "help":
    default:
      displayHelp()
  }
})()
