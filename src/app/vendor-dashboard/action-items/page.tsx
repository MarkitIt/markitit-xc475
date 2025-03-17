import React from "react";

const ActionItems = () => {
  const tasks = [
    { id: 1, task: "Complete vendor profile", completed: false },
    { id: 2, task: "Upload product catalog", completed: true },
  ];

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Action Items</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="text-sm flex items-center space-x-2">
            <input type="checkbox" checked={task.completed} readOnly />
            <span className={task.completed ? "line-through text-gray-400" : ""}>{task.task}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionItems;
