#!/usr/bin/env node

import fs from "fs"
import axios from "axios"
import ora from "ora"

type ImportMap = {
  imports: { [key: string]: string }
}

const [, , command, packageArg] = process.argv
const importMapFile = "im.json"

async function getPackageUrl(
  packageName: string,
  version?: string
): Promise<string | null> {
  try {
    const response = await axios.head(
      `https://esm.sh/${packageName}${version ? "@" + version : ""}`
    )
    return response.request.res.responseUrl
  } catch (error) {
    return null
  }
}

async function addOrUpdatePackage(
  packageArg: string,
  update = false
): Promise<void> {
  const spinner = ora("Checking package on esm.sh...").start()
  const [packageName, version] = packageArg.split("@")
  const packageUrl = await getPackageUrl(packageName, version)

  if (!packageUrl) {
    spinner.fail(
      `Package ${packageName}${
        version ? "@" + version : ""
      } not found on esm.sh.`
    )
    return
  }

  const importMap: ImportMap = fs.existsSync(importMapFile)
    ? JSON.parse(fs.readFileSync(importMapFile, "utf8"))
    : { imports: {} }

  if (update && !importMap.imports[packageName]) {
    spinner.fail(`Package ${packageName} not found in im.json.`)
    return
  }

  importMap.imports[packageName] = packageUrl
  fs.writeFileSync(importMapFile, JSON.stringify(importMap, null, 2))

  const action = update ? "updated" : "added"
  spinner.succeed(
    `Package ${packageName}${version ? "@" + version : ""} ${action} to im.json`
  )
}

function deletePackage(packageName: string): void {
  // ...
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
    "  im delete <package-name>             Delete a package from the import map"
  )
  console.log(
    "  im help                              Display this help message"
  )
}

;(async () => {
  switch (command) {
    case "add":
    case "update":
      if (packageArg) {
        await addOrUpdatePackage(packageArg, command === "update")
      }
      break
    case "delete":
      if (packageArg) {
        deletePackage(packageArg)
      }
      break
    case "help":
    default:
      displayHelp()
  }
})()
