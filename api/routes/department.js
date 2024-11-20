const express = require('express');

const router = express.Router(); 
const Department = require('../models/department_model');


// Create a new department
router.post("/", async (req, res) => {
    try {
      const { name, description, executives } = req.body;
  
      // Create and save the department
      const department = new Department({ name, description, executives });
      await department.save();
  
      res.status(201).json({ ok: true, msg: "Department created successfully", department });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Failed to create department", error });
    }
  });



  // Update executives of a department
router.put("/:id/executives", async (req, res) => {
    try {
      const { executives } = req.body;
  
      const department = await Department.findByIdAndUpdate(
        req.params.id,
        { executives },
        { new: true, runValidators: true } // Return updated document and validate inputs
      );
  
      if (!department) {
        return res.status(404).json({ ok: false, msg: "Department not found" });
      }
  
      res.status(200).json({ ok: true, msg: "Executives updated successfully", department });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Failed to update executives", error });
    }
  });

  

  // Get all departments
router.get("/", async (req, res) => {
    try {
      const departments = await Department.find().sort({ createdAt: -1 });
      res.status(200).json({ ok: true, msg: "Departments fetched successfully", departments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Failed to fetch departments", error });
    }
  });
  
  // Get a single department by ID
  router.get("/:id", async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);
      if (!department) {
        return res.status(404).json({ ok: false, msg: "Department not found" });
      }
      res.status(200).json({ ok: true, msg: "Department fetched successfully", department });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, msg: "Failed to fetch department", error });
    }
  });
  
  

  module.exports = router;