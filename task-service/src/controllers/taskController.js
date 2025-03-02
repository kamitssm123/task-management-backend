import { sequelize, Task } from '../models/Task.js';


export const getTaskMetrics = async (req, res) => {
  console.log("Inside getTaskMetrics")
  const userId = req.user.id;
  console.log(userId)

  const sqlQuery = `
      WITH task_counts AS (
          SELECT 
              COUNT(*) AS total_tasks,
              SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
              SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending_tasks
          FROM tasks
          WHERE user_id = :userId
      ),
      completed_task_data AS (
          SELECT 
              AVG(EXTRACT(EPOCH FROM (end_time::timestamp - start_time::timestamp)) / 3600.0) AS avg_time_per_completed_task
          FROM tasks
          WHERE status = 'Completed' AND user_id = :userId AND end_time IS NOT NULL
      ),
      pending_task_data AS (
          SELECT 
              COUNT(*) AS pending_tasks,
              SUM(EXTRACT(EPOCH FROM (NOW() - start_time::timestamp)) / 3600.0) AS total_time_lapsed,
              SUM(EXTRACT(EPOCH FROM (end_time::timestamp - NOW())) / 3600.0) AS total_time_to_finish
          FROM tasks
          WHERE status = 'Pending' AND user_id = :userId
      )
      SELECT 
          tc.total_tasks,
          ROUND((tc.completed_tasks * 100.0 / NULLIF(tc.total_tasks, 0)), 2) AS completed_percentage,
          ROUND((tc.pending_tasks * 100.0 / NULLIF(tc.total_tasks, 0)), 2) AS pending_percentage,
          COALESCE(ctd.avg_time_per_completed_task, 0) AS avg_time_per_completed_task,
          ptd.pending_tasks,
          COALESCE(ptd.total_time_lapsed, 0) AS total_time_lapsed,
          COALESCE(ptd.total_time_to_finish, 0) AS total_time_to_finish
      FROM task_counts tc
      LEFT JOIN completed_task_data ctd ON TRUE
      LEFT JOIN pending_task_data ptd ON TRUE;
  `;
  const sqlQuery_task = `
      SELECT 
          priority AS "Task priority",
          COUNT(*) FILTER (WHERE status = 'Pending') AS "Pending tasks",
          round((EXTRACT(EPOCH FROM (NOW() - MIN(start_time::timestamp))) / 3600), 2) AS "Time lapsed (hrs)",
          round((EXTRACT(EPOCH FROM (AVG(end_time::timestamp - start_time::timestamp))) / 3600), 2) AS "Time to finish (hrs)"
      FROM tasks where user_id = :userId
      GROUP BY priority
      ORDER BY priority;
  `

  try {
      const [taskMetrics] = await sequelize.query(sqlQuery, {
          replacements: { userId },
          type: sequelize.QueryTypes.SELECT,
      });

      const topTasks = await sequelize.query(sqlQuery_task, {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT,
    });

      res.status(200).json({
          taskMetrics,
          topTasks,
      });
  } catch (error) {
      console.error('Error fetching task data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const createTask = async (req, res) => {
  try {
    console.log(req.body);
    const { title, priority, status, start_time, end_time  } = req.body;
    const user_id = req.user.id;

    const rawNewTask = await Task.create({
      title,
      priority,
      user_id: user_id,
      status,
      start_time,
      end_time
    });
    const newTask = rawNewTask.get({ plain: true });
    const task = {
      ...newTask,
      start_time: newTask.start_time ? new Date(newTask.start_time).getTime() : null,
      end_time: newTask.end_time ? new Date(newTask.end_time).getTime() : null
  }

    res.status(201).send(task);
  } catch (error) {
    res.status(500).send({ message: 'Error creating task', error });
  }
};


export const getTasks = async (req, res) => {
  try {
      let { page = 1, limit = 10, sort, priority, status } = req.query;
      const user = req.user;
      page = parseInt(page);
      limit = parseInt(limit);

      const sortOptions = {
          "start_time_asc": ["start_time", "ASC"],
          "start_time_desc": ["start_time", "DESC"],
          "end_time_asc": ["end_time", "ASC"],
          "end_time_desc": ["end_time", "DESC"],
      };

      let where = {};
      if (priority) {
          where.priority = priority;
      }

      if (status) {
          where.status = status;
      }
      if(user){
        where.user_id = user.id;
      }
      const { rows: rawTasks, count } = await Task.findAndCountAll({
          where,
          order: [sortOptions[sort] || ["created_at", "DESC"]],
          limit,
          offset: (page - 1) * limit,
          raw: true
      });
      
      const tasks = rawTasks.map(task => ({
        ...task,
        start_time: task.start_time ? new Date(task.start_time).getTime() : null,
        end_time: task.end_time ? new Date(task.end_time).getTime() : null,
        created_at: task.created_at ? new Date(task.created_at).getTime() : null
    }));

      res.status(200).send({
          page,
          limit,
          totalPages: Math.ceil(count / limit),
          totalTasks: count,
          tasks,
      });
  } catch (error) {
      res.status(500).send({ message: "Error fetching tasks", error });
  }
};

  

export const getTaskById = async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const task = await Task.findOne({
        where: {
          id: id,
          user_id: user_id
        }
      });
      if (task) {
        res.status(200).send(task);
      } else {
        res.status(404).send({ message: `Task with ID ${id} not found` });
      }
    } catch (error) {
      res.status(500).send({ message: 'Error fetching task', error });
    }
  };
  

export const updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, priority, status, start_time, end_time } = req.body;
      const user_id = req.user;

      const task = await Task.findOne({
        where: {
          id: id,
          user_id: user_id
        }
      });
      if (!task) {
        return res.status(404).send({ message: `Task with ID ${id} not found` });
      }

      if (task.user_id !== user.id) {
        return res.status(403).send({ message: 'You are not authorized to update this task' });
      }

      task.title = title || task.title;
      task.priority = priority || task.priority;
      task.status = status || task.status;
      task.start_time = start_time || task.start_time;
      task.end_time = end_time || task.end_time;

      await task.save();
      res.status(200).send(task);
    } catch (error) {
      res.status(500).send({ message: 'Error updating task', error });
    }
  };
  

export const deleteTasks = async (req, res) => {
    try {
      const { ids } = req.body; // Expecting an array of task IDs
      const user_id = req.user.id;
  
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).send({ message: "Invalid request. Provide an array of task IDs." });
      }
  
      // Delete tasks that belong to the user and match the given IDs
      const deletedCount = await Task.destroy({
        where: {
          id: ids,
          user_id: user_id
        }
      });
  
      if (deletedCount === 0) {
        return res.status(404).send({ message: "No tasks found or unauthorized request." });
      }
  
      res.status(200).send({ message: `Deleted ${deletedCount} task(s) successfully`, deletedIds: ids });
    } catch (error) {
      console.error("Error deleting tasks:", error);
      res.status(500).send({ message: "Error deleting tasks", error });
    }
  };
  
  
