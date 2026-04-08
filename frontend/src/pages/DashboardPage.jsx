import { useDeferredValue, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "../api/apiClient";
import ThemeToggle from "../components/ThemeToggle";
import useAuth from "../hooks/useAuth";

const emptyTaskForm = {
  title: "",
  description: "",
  status: "pending",
  dueDate: "",
};

const emptyNoteForm = {
  title: "",
  content: "",
};

const formatDate = (value) => {
  if (!value) {
    return "No due date";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function DashboardPage({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [noteForm, setNoteForm] = useState(emptyNoteForm);
  const [editingTaskId, setEditingTaskId] = useState("");
  const [editingNoteId, setEditingNoteId] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [noteSearch, setNoteSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [taskError, setTaskError] = useState("");
  const [noteError, setNoteError] = useState("");
  const [flashMessage, setFlashMessage] = useState("");

  const deferredTaskSearch = useDeferredValue(taskSearch);
  const deferredNoteSearch = useDeferredValue(noteSearch);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setPageError("");

      try {
        const [tasksResponse, notesResponse] = await Promise.all([
          apiClient.get("/tasks"),
          apiClient.get("/notes"),
        ]);

        setTasks(tasksResponse.data);
        setNotes(notesResponse.data);
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
          navigate("/login", { replace: true });
          return;
        }

        setPageError(error.response?.data?.message || "Unable to load your dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [logout, navigate]);

  useEffect(() => {
    if (!flashMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => setFlashMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [flashMessage]);

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === "all" ? true : task.status === statusFilter;
    const searchValue = deferredTaskSearch.trim().toLowerCase();
    const matchesSearch =
      !searchValue ||
      task.title.toLowerCase().includes(searchValue) ||
      (task.description || "").toLowerCase().includes(searchValue);

    return matchesStatus && matchesSearch;
  });

  const filteredNotes = notes.filter((note) => {
    const searchValue = deferredNoteSearch.trim().toLowerCase();

    if (!searchValue) {
      return true;
    }

    return (
      note.title.toLowerCase().includes(searchValue) ||
      note.content.toLowerCase().includes(searchValue)
    );
  });

  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const pendingCount = tasks.length - completedCount;
  const dueSoonCount = tasks.filter((task) => {
    if (!task.dueDate || task.status === "completed") {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    const currentDate = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(currentDate.getDate() + 3);

    return dueDate >= currentDate && dueDate <= threeDaysLater;
  }).length;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleTaskChange = (event) => {
    const { name, value } = event.target;
    setTaskForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleNoteChange = (event) => {
    const { name, value } = event.target;
    setNoteForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const resetTaskForm = () => {
    setTaskForm(emptyTaskForm);
    setEditingTaskId("");
  };

  const resetNoteForm = () => {
    setNoteForm(emptyNoteForm);
    setEditingNoteId("");
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();
    setTaskSubmitting(true);
    setTaskError("");

    try {
      if (editingTaskId) {
        const { data } = await apiClient.put(`/tasks/${editingTaskId}`, taskForm);
        setTasks((currentTasks) =>
          currentTasks.map((task) => (task._id === data._id ? data : task))
        );
        setFlashMessage("Task updated successfully");
      } else {
        const { data } = await apiClient.post("/tasks", taskForm);
        setTasks((currentTasks) => [data, ...currentTasks]);
        setFlashMessage("Task created successfully");
      }

      resetTaskForm();
    } catch (error) {
      setTaskError(error.response?.data?.message || "Unable to save this task.");
    } finally {
      setTaskSubmitting(false);
    }
  };

  const handleNoteSubmit = async (event) => {
    event.preventDefault();
    setNoteSubmitting(true);
    setNoteError("");

    try {
      if (editingNoteId) {
        const { data } = await apiClient.put(`/notes/${editingNoteId}`, noteForm);
        setNotes((currentNotes) =>
          currentNotes.map((note) => (note._id === data._id ? data : note))
        );
        setFlashMessage("Note updated successfully");
      } else {
        const { data } = await apiClient.post("/notes", noteForm);
        setNotes((currentNotes) => [data, ...currentNotes]);
        setFlashMessage("Note created successfully");
      }

      resetNoteForm();
    } catch (error) {
      setNoteError(error.response?.data?.message || "Unable to save this note.");
    } finally {
      setNoteSubmitting(false);
    }
  };

  const startTaskEdit = (task) => {
    setEditingTaskId(task._id);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "",
    });
  };

  const startNoteEdit = (note) => {
    setEditingNoteId(note._id);
    setNoteForm({
      title: note.title,
      content: note.content,
    });
  };

  const handleTaskDelete = async (taskId) => {
    const shouldDelete = window.confirm("Delete this task?");

    if (!shouldDelete) {
      return;
    }

    try {
      await apiClient.delete(`/tasks/${taskId}`);
      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));

      if (editingTaskId === taskId) {
        resetTaskForm();
      }

      setFlashMessage("Task deleted successfully");
    } catch (error) {
      setTaskError(error.response?.data?.message || "Unable to delete this task.");
    }
  };

  const handleNoteDelete = async (noteId) => {
    const shouldDelete = window.confirm("Delete this note?");

    if (!shouldDelete) {
      return;
    }

    try {
      await apiClient.delete(`/notes/${noteId}`);
      setNotes((currentNotes) => currentNotes.filter((note) => note._id !== noteId));

      if (editingNoteId === noteId) {
        resetNoteForm();
      }

      setFlashMessage("Note deleted successfully");
    } catch (error) {
      setNoteError(error.response?.data?.message || "Unable to delete this note.");
    }
  };

  const toggleTaskStatus = async (task) => {
    const updatedStatus = task.status === "completed" ? "pending" : "completed";

    try {
      const { data } = await apiClient.put(`/tasks/${task._id}`, {
        ...task,
        status: updatedStatus,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "",
      });

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => (currentTask._id === data._id ? data : currentTask))
      );
      setFlashMessage("Task status updated");
    } catch (error) {
      setTaskError(error.response?.data?.message || "Unable to change task status.");
    }
  };

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-three" />
        <section className="dashboard-shell loading-shell">
          <p className="loading-text">Loading your workspace...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <section className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Smart workspace</p>
            <h1>{user?.name?.split(" ")[0] || "User"}, here is your focus board.</h1>
            <p className="dashboard-subtitle">
              Create tasks, keep notes nearby, and stay on top of what needs attention next.
            </p>
          </div>

          <div className="header-actions">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button className="secondary-button" type="button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <span>Total tasks</span>
            <strong>{tasks.length}</strong>
            <p>Everything currently in your workflow.</p>
          </article>
          <article className="stat-card">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
            <p>Tasks still waiting for action.</p>
          </article>
          <article className="stat-card">
            <span>Completed</span>
            <strong>{completedCount}</strong>
            <p>Work you have already wrapped up.</p>
          </article>
          <article className="stat-card">
            <span>Due soon</span>
            <strong>{dueSoonCount}</strong>
            <p>Pending tasks scheduled within the next 3 days.</p>
          </article>
        </section>

        {pageError ? <p className="form-message error">{pageError}</p> : null}
        {flashMessage ? <p className="form-message success">{flashMessage}</p> : null}

        <section className="dashboard-grid">
          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Tasks</p>
                <h2>{editingTaskId ? "Edit task" : "Add a task"}</h2>
              </div>
            </div>

            <form className="stack-form" onSubmit={handleTaskSubmit}>
              <div className="field-group">
                <label htmlFor="task-title">Title</label>
                <input
                  id="task-title"
                  name="title"
                  type="text"
                  placeholder="Task title"
                  value={taskForm.title}
                  onChange={handleTaskChange}
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="task-description">Description</label>
                <textarea
                  id="task-description"
                  name="description"
                  rows="4"
                  placeholder="Task description"
                  value={taskForm.description}
                  onChange={handleTaskChange}
                />
              </div>

              <div className="form-grid">
                <div className="field-group">
                  <label htmlFor="task-status">Status</label>
                  <select
                    id="task-status"
                    name="status"
                    value={taskForm.status}
                    onChange={handleTaskChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="field-group">
                  <label htmlFor="task-due-date">Due date</label>
                  <input
                    id="task-due-date"
                    name="dueDate"
                    type="date"
                    value={taskForm.dueDate}
                    onChange={handleTaskChange}
                  />
                </div>
              </div>

              {taskError ? <p className="form-message error">{taskError}</p> : null}

              <div className="action-row">
                <button className="primary-button" type="submit" disabled={taskSubmitting}>
                  {taskSubmitting
                    ? "Saving..."
                    : editingTaskId
                      ? "Update task"
                      : "Create task"}
                </button>
                {editingTaskId ? (
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={resetTaskForm}
                    disabled={taskSubmitting}
                  >
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>

            <div className="toolbar">
              <input
                type="search"
                placeholder="Search tasks"
                value={taskSearch}
                onChange={(event) => setTaskSearch(event.target.value)}
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="list-column">
              {filteredTasks.length ? (
                filteredTasks.map((task) => (
                  <article className="item-card" key={task._id}>
                    <div className="item-card-top">
                      <div>
                        <h3>{task.title}</h3>
                        <p>{task.description || "No description added yet."}</p>
                      </div>
                      <span className={`status-pill ${task.status}`}>{task.status}</span>
                    </div>

                    <div className="item-meta">
                      <span>Due: {formatDate(task.dueDate)}</span>
                      <span>Updated: {formatDate(task.updatedAt)}</span>
                    </div>

                    <div className="action-row compact">
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={() => toggleTaskStatus(task)}
                      >
                        Mark as {task.status === "completed" ? "pending" : "completed"}
                      </button>
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={() => startTaskEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="ghost-button danger"
                        type="button"
                        onClick={() => handleTaskDelete(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <h3>No tasks found</h3>
                  <p>Add a task or adjust your search and filters.</p>
                </div>
              )}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Notes</p>
                <h2>{editingNoteId ? "Edit note" : "Capture a note"}</h2>
              </div>
            </div>

            <form className="stack-form" onSubmit={handleNoteSubmit}>
              <div className="field-group">
                <label htmlFor="note-title">Title</label>
                <input
                  id="note-title"
                  name="title"
                  type="text"
                  placeholder="Title"
                  value={noteForm.title}
                  onChange={handleNoteChange}
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="note-content">Content</label>
                <textarea
                  id="note-content"
                  name="content"
                  rows="6"
                  placeholder="Write your quick note"
                  value={noteForm.content}
                  onChange={handleNoteChange}
                  required
                />
              </div>

              {noteError ? <p className="form-message error">{noteError}</p> : null}

              <div className="action-row">
                <button className="primary-button" type="submit" disabled={noteSubmitting}>
                  {noteSubmitting
                    ? "Saving..."
                    : editingNoteId
                      ? "Update note"
                      : "Create note"}
                </button>
                {editingNoteId ? (
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={resetNoteForm}
                    disabled={noteSubmitting}
                  >
                    Cancel edit
                  </button>
                ) : null}
              </div>
            </form>

            <div className="toolbar single">
              <input
                type="search"
                placeholder="Search notes"
                value={noteSearch}
                onChange={(event) => setNoteSearch(event.target.value)}
              />
            </div>

            <div className="notes-grid">
              {filteredNotes.length ? (
                filteredNotes.map((note) => (
                  <article className="note-card" key={note._id}>
                    <div className="item-card-top">
                      <div>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                      </div>
                    </div>

                    <div className="item-meta">
                      <span>Updated: {formatDate(note.updatedAt)}</span>
                    </div>

                    <div className="action-row compact">
                      <button
                        className="ghost-button"
                        type="button"
                        onClick={() => startNoteEdit(note)}
                      >
                        Edit
                      </button>
                      <button
                        className="ghost-button danger"
                        type="button"
                        onClick={() => handleNoteDelete(note._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <h3>No notes yet</h3>
                  <p>Capture your first note to keep context close to your tasks.</p>
                </div>
              )}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

export default DashboardPage;
