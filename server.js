const express = require("express")
const inquirer = require("inquirer")
const mysql = require("mysql")

const app = express()

const PORT = process.env.PORT || 8080

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Random@123",
    database: "employeeDB"
})

connection.connect(err => {
    if (err) throw err
    console.log("connected as id " + connection.threadId + "\n");
    exApp()
})

app.listen(PORT, () => {
    console.log("Server listening on: http://localhost:" + PORT)
})

async function switchFunction(res) {
    switch (res.action) {
        case "View":
            let tempQuery = `SELECT * FROM ${res.table};`
            await connection.query(tempQuery, (err, resp) => {
                if (err) throw err
                console.log(`
                `)
                console.table(resp)
            })
            break
        case "Add":
            if (res.table === "Department") {
                let addDeptQuery = `INSERT INTO ${res.table} (name) VALUES ("${res.addDept}");`
                await runSQL(res, addDeptQuery)
            } else if (res.table === "Role") {
                let tempArray = res.addRole.split(",")
                let tempQuery = `INSERT INTO ${res.table} (title, salary, department_id) VALUES ("${tempArray[0]}", ${tempArray[1]}, ${tempArray[2]});`
                await runSQL(res, tempQuery)
            } else {
                let tempArray = res.addEmployee.split(",")
                let tempQuery = `INSERT INTO ${res.table} (first_name, last_name, role_id, manager_id) VALUES ("${tempArray[0]}", "${tempArray[1]}", ${tempArray[2]},${tempArray[3]});`
                await runSQL(res, tempQuery)
            }

            break
        case "Update":
            if (res.table === "Department") {
                let resArray = res.updateDept.split(",")
                let updateDeptQuery = `UPDATE ${res.table} SET name = "${resArray[1]}" WHERE id = ${resArray[0]};`
                await runSQL(res, updateDeptQuery)
            } else if (res.table === "Role") {
                let resArray = res.updateRole.split(",")
                let tempQuery = `UPDATE ${res.table} SET title = "${resArray[1]}", salary = ${resArray[2]}, department_id = ${resArray[3]} WHERE id = ${resArray[0]};`
                await runSQL(res, tempQuery)
            } else {
                let resArray = res.updateEmployee.split(",")
                let tempQuery = `UPDATE ${res.table} SET first_name = "${resArray[1]}", last_name = "${resArray[2]}", role_id = ${resArray[3]}, manager_id = ${resArray[4]}  WHERE id = ${resArray[0]};`
                await runSQL(res, tempQuery)
            }
            break
    }
}

async function runSQL(inqAns, sqlQuery) {
    await connection.query(sqlQuery, (err, resp) => {
        if (err) throw err
        let display = `SELECT * FROM ${inqAns.table}`
        connection.query(display, (err, res) => {
            if (err) throw err
            console.log(`
            `)
            console.table(res)
        })
    })
}

async function keepRunning() {
    const result = await inquirer.prompt([
        {
            type: "confirm",
            name: "continue",
            message: "Would you like to continue?"
        }
    ])
    if (result.continue) {
        await exApp()
    } else {
        console.log("ending database connection")
        connection.end()
    }
}

async function main() {
    const response = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What do you like to do?",
            choices: ["Add", "View", "Update"]
        },
        {
            type: "list",
            name: "table",
            message: "Please choose the table you like to work with",
            choices: ["Department", "Role", "Employee"]
        },
        {
            type: "input",
            name: "addDept",
            message: "Please enter Department name to add",
            when: function (res) {
                return (res.table === "Department" && res.action === "Add")
            }
        },
        {
            type: "input",
            name: "updateDept",
            message: "Please enter Department ID to update and the new department name (sparate by comma)",
            when: function (res) {
                return (res.table === "Department" && res.action === "Update")
            }
        },
        {
            type: "input",
            name: "updateRole",
            message: "Please enter role id you like to runApp folow by title, salary, and dept id (separate by comma)",
            when: function (res) {
                return (res.action === "Update" && res.table === "Role")
            }
        },
        {
            type: "input",
            name: "addRole",
            message: "Please enter title, salary, and dept id (separate by comma)",
            when: function (res) {
                return (res.action === "Add" && res.table === "Role")
            }
        },
        {
            type: "input",
            name: "updateEmployee",
            message: "Please enter employee id you like to edit folow by updated first name, last name, role id and manager id (separate by comma)",
            when: function (res) {
                return (res.action === "Update" && res.table === "Employee")
            }
        },
        {
            type: "input",
            name: "addEmployee",
            message: "Please enter first name, last name, role id and manager id (separate by comma)",
            when: function (res) {
                return (res.action === "Add" && res.table === "Employee")
            }
        }
    ])
    await switchFunction(response)
}

async function exApp() {
    await main()
    await keepRunning()
}