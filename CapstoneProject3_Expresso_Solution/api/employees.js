const express = require('express');
const employeesRouter = express();
module.exports = employeesRouter;

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//define param $employeeId
employeesRouter.param('employeeId',(req,res,next,employeeId)=>{
  const sql = `SELECT * FROM Employee where Employee.id = $employeeId`;
  const values = {$employeeId: employeeId};
  db.get(sql,values,(err,employee)=>{
    if(err){
      next(err);
    }
    else if (employee){
        req.employee = employee;
        next();
      }
      else {
        res.sendStatus(404);
      }
    })
})

//import timesheetsrouter and link to endpoint for employeeId. mergeParams set in timesheets.js
const timesheetsRouter = require('./timesheets.js');
employeesRouter.use('/:employeeId/timesheets', timesheetsRouter);

//Router to retrieve all current employees
employeesRouter.get('/', (req, res, next) => {
  const sql = 'SELECT * FROM Employee WHERE Employee.is_current_employee = 1';
  db.all(sql,(err, employees) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({employees: employees});
      }
    });
});

//Router to retrieve single Employee by ID, with use of router.param req.employee object.
employeesRouter.get('/:employeeId', (req, res, next) => {
  res.status(200).json({employee: req.employee});
});

//Create new Employee with use of Body-parser on object body.employee.
employeesRouter.post('/', (req, res, next) => {

  if (!req.body.employee.name || !req.body.employee.position || !req.body.employee.wage) {
    return res.sendStatus(400);
  }
  // not really necessary to check value of is_current_employee since this is not in any way an inputfield in the gui. Therefore set to 1.
  //const isCurrentEmployee = req.body.employee.is_current_employee === 0 ? 0 : 1;
  const isCurrentEmployee = 1;
  const values = {$name: req.body.employee.name,
                  $position: req.body.employee.position,
                  $wage: req.body.employee.wage,
                  $is_current_employee: isCurrentEmployee};
  const sql = 'INSERT INTO Employee (name,position,wage, is_current_employee) VALUES ($name,$position,$wage,$is_current_employee)';
  db.run(sql, values, function(err){
      if (err) {
        next(err);
      } else {
        //get newly created Employee to return
        db.get(`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`,
          (error, employee) => {
            res.status(201).json({employee: employee});
          });
      }
    });
});

// update Employee with use of Body-parser, router param req.params object
employeesRouter.put('/:employeeId', (req, res, next) => {
  if (!req.body.employee.name || !req.body.employee.position || !req.body.employee.wage) {
    return res.sendStatus(400);
  }

  const sql = 'UPDATE Employee SET name = $name, position=$position, wage = $wage, is_current_employee = $is_current_employee  ' +
      'WHERE Employee.id = $employeeId';
  const isCurrentEmployee = 1;
  const values = {
    $name: req.body.employee.name,
    $position: req.body.employee.position,
    $wage: req.body.employee.wage,
    $is_current_employee: isCurrentEmployee,
    $employeeId: req.params.employeeId
  };

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`,
        (error, employee) => {
          res.status(200).json({employee: employee});
        });
    }
  });
});

// Delete Employee by updating is_current_employee to 0 with use of Body-parser, router param req.params object
employeesRouter.delete('/:employeeId', (req, res, next) => {
  const sql = 'UPDATE Employee SET is_current_employee = 0 WHERE Employee.id = $employeeId';
  const values = {$employeeId: req.params.employeeId};

  db.run(sql, values, (error) => {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.params.employeeId}`,
        (error, employee) => {
          res.status(200).json({employee: employee});
        });
    }
  });
});
