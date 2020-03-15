import open from "open"
import { createInterface } from "readline"
import { readFileSync } from "fs"
import { resolve, dirname } from "path"

async function run() {
  try {
    // console.log(process)

    // Get working directory of [this] script
    const __dirname = dirname(process.argv[1])
    // Get contents from file and parse to JSON
    const contents = await readFileSync(resolve(__dirname, "menu.json"))
    const jsonContent = await JSON.parse(contents);

    // Print first menu
    let template = "Choose a session:\n\n\r"
    template += buildMenu(jsonContent.mainOptions)
    console.log(template)

    // Wait for user input
    const userMainChoice = await userPrompt()
    // Find user's first menu choice
    let {submenu} = jsonContent.mainOptions.find(item => item.id == userMainChoice)

    // Clears terminal console
    console.clear()

    template = "Pick a focus:\n\n\r"
    template += buildMenu(submenu)
    console.log(template)

    // Wait for user input
    const userSubChoice = await userPrompt()
    // Find user's second menu choice
    let {tasks} = submenu.find(item => item.id == userSubChoice)

    // Execute tasks on submenu choice
    executeTasks(tasks)
  }
  catch(error) {
    console.log("Error =>", error)
  }
}
run()

/**
 * Function to build menu template
 * @param {Array} tasks
 * @returns {Array}
 */
function executeTasks(tasks = new Array) {
  tasks.forEach(task => {
    console.log("Executing Task... ", task)
    eval(`${task.cmd}(${task.instructions})`)
  })
  return tasks
}

/**
 * Function to build menu template
 * @param {Array} options Array of objects containing menu items.
 * @return {String}
 */
function buildMenu(options = new Array) {
  let template = new String
  options.forEach((element, index) => {
    template += `${index + 1}.) ${element.name}\n\r`
  })
  return template
}

/**
 * Prompt user for input
 * @return {Promise}
 */
function userPrompt() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise(resolve => rl.question("", ans => {
    rl.close()
    resolve(ans)
  }))
}
