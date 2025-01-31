document.addEventListener("DOMContentLoaded", () => {
  const tasksContainers = document.querySelectorAll(".tasks-container");
  const taskCards = document.querySelectorAll(".task-card");

  taskCards.forEach((card) => {
    card.addEventListener("dragstart", () => {
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      updateTaskStatus(card);
    });
  });

  tasksContainers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingCard = document.querySelector(".dragging");
      container.appendChild(draggingCard);
    });
  });

  async function updateTaskStatus(card) {
    const newStatus = card.parentElement.dataset.status;
    const taskId = card.dataset.taskId;
    const newOrder = Array.from(card.parentElement.children).indexOf(card);

    try {
      const response = await fetch("/tasks/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          newStatus,
          newOrder,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      // Mostrar mensaje de error al usuario
    }
  }
});
