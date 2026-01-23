import { useState, useEffect } from "react";
import axios from "axios";
import Auth from "./pages/Auth";
import WeeklyCharts from "./components/WeeklyCharts";
import logo from "./assets/StuduntHub.png";

axios.defaults.baseURL = "https://student-dashboard-backend-yyua.onrender.com";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user?.id || payload.id;
  } catch {
    return null;
  }
};

function App() {

  const [user, setUser] = useState(null);
  const [category, setCategory] = useState("Study");
  const [searchText, setSearchText] = useState("");
  const [dark, setDark] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [page, setPage] = useState("tasks");
  const [userId, setUserId] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [studyHours, setStudyHours] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState([]);
  const [priority, setPriority] = useState("Low");
  const [schedules, setSchedules] = useState([]);
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dailyGoal, setDailyGoal] = useState(5); // default 5 hours
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("/api/schedule").then(res => setSchedules(res.data));
      axios.get("/api/tasks").then(res => setTasks(res.data));
      axios.get("/api/notes").then(res => setNotes(res.data));
      axios.get("/api/goals").then(res => setGoals(res.data));
    }
  }, []);

  useEffect(() => {
    syncUserFromToken();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const studyKey = `studyHours_${userId}`;
    const sessionKey = `sessions_${userId}`;

    const savedHours = localStorage.getItem(studyKey);
    const savedSessions = localStorage.getItem(sessionKey);

    if (savedHours !== null) {
      setStudyHours(parseInt(savedHours));
    }

    if (savedSessions !== null) {
      setSessions(JSON.parse(savedSessions));
    }

    setHydrated(true); 
  }, [userId]);

  useEffect(() => {
    if (!userId || !hydrated) return;
    localStorage.setItem(`studyHours_${userId}`, studyHours);
  }, [studyHours, userId, hydrated]);

  useEffect(() => {
    if (!userId || !hydrated) return;
    localStorage.setItem(`sessions_${userId}`, JSON.stringify(sessions));
  }, [sessions, userId, hydrated]);

  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    if (studyHours < 2) {
      new Notification("📚 Study Reminder", {
        body: "You haven’t studied much today. Try 1 more hour 💪"
      });
    }
  }, [studyHours]);

  useEffect(() => {
    if (!("Notification" in window)) return;

    tasks.forEach(task => {
      if (
        task.dueDate === today &&
        !task.completed
      ) {
        new Notification("⏰ Task Due Today!", {
          body: task.text
        });
      }
    });
  }, [tasks]);

  const syncUserFromToken = () => {
    const id = getUserIdFromToken();
    if (id) {
      setUserId(id);
    }
  };

  const addTask = () => {
    if (task.trim() === "") return;

    axios.post("/api/tasks",
    {
      text: task,
      completed: false,
      category,
      dueDate,
      priority
    },
    {
      headers: {
        "x-auth-token": localStorage.getItem("token")
      }
    })
    .then(res => {
      setTasks([...tasks, res.data]);
      setTask("");
      setDueDate("");
    });
  };

  const deleteTask = (id) => {
    axios.delete(`/api/tasks/${id}`, {
      headers: {
        "x-auth-token": localStorage.getItem("token")
      }
    })
    .then(() => {
      setTasks(tasks.filter(t => t._id !== id));
    });
  };

  const toggleTask = (task) => {
    axios.put(`/api/tasks/${task._id}`,
    {
      completed: !task.completed
    },
    {
      headers: {
        "x-auth-token": localStorage.getItem("token")
      }
    })
    .then(res => {
      setTasks(tasks.map(t => t._id === res.data._id ? res.data : t));
    });
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].text);
  };

  const saveEdit = () => {
    const taskToEdit = tasks[editIndex];
    axios.put(`/api/tasks/${taskToEdit._id}`,
    {
      text: editText
    },
    {
      headers: {
        "x-auth-token": localStorage.getItem("token")
      }
    })
    .then(res => {
      setTasks(tasks.map(t => t._id === res.data._id ? res.data : t));
      setEditIndex(null);
      setEditText("");
    });
  };

  const addNote = () => {
    if (note.trim() === "") return;
    axios.post("/api/notes",
      { text: note },
      {
        headers: {
          "x-auth-token": localStorage.getItem("token")
        }
      }
    ).then(res => {
      setNotes([...notes, res.data]);
      setNote("");
    });
  };

  const addGoal = () => {
    if (goal.trim() === "") return;

    axios.post("/api/goals", { text: goal }, {
      headers: {
        "x-auth-token": localStorage.getItem("token")
      }
    })
      .then(res => {
        setGoals([...goals, res.data]);
        setGoal("");
      })
      .catch(err => {
        console.log(err.response?.data);
        alert("Goal not saved");
      });
  };

  const addSchedule = () => {
    if (!subject || !startTime || !endTime) return;

    axios.post("/api/schedule", {
      subject,
      day,
      startTime,
      endTime
    }).then(res => {
      setSchedules([...schedules, res.data]);
      setSubject("");
      setStartTime("");
      setEndTime("");
    });
  };

  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
  const pending = total - completed;
  const today = new Date().toISOString().split("T")[0];

  // SMART FEATURES

  const productivityMessage = () => {
    if (progress >= 80) return " Excellent productivity! Keep it up.";
    if (progress >= 50) return " Good job! You are on the right track.";
    if (progress >= 30) return " Try to focus more on completing tasks.";
    return " Let's start strong! Small steps matter.";
  };

  const weeklyPerformance = () => {
    if (studyHours >= 10) return "🌟 Amazing weekly consistency!";
    if (studyHours >= 5) return "👍 Good progress this week!";
    return "📈 Let’s try to study more next week!";
  };

  const smartPriority = (task) => {
    if (task.dueDate === today) return "High";
    if (task.priority === "High") return "High";
    if (task.priority === "Medium") return "Medium";
    return "Low";
  };

  if (!localStorage.getItem("token")) {
    return <Auth setUser={setUser} syncUser={syncUserFromToken} />;
  }

  // Styles
  const sidebarStyle = {
    position: "fixed",
    left: 0,
    top: 0,
    height: "100vh",
    width: "260px",
    background: dark ? "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)" : "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
    padding: "0",
    borderRight: dark ? "1px solid #2d3748" : "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    boxShadow: dark ? "2px 0 10px rgba(0,0,0,0.3)" : "2px 0 10px rgba(0,0,0,0.05)"
  };

  const sidebarHeaderStyle = {
    padding: "6px",
    margin: "8px",
    borderRadius: "12px",
    background: dark ? "linear-gradient(135deg, #1e293b, #0f172a)" : "rgba(99,102,241,0.06)",
    border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #b7c2d1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };

  const navContainerStyle = {
    padding: "16px 12px",
    flex: "1",
    overflowY: "auto"
  };

  const navItemStyle = (isActive) => ({
    padding: "12px 16px",
    margin: "4px 0",
    cursor: "pointer",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: isActive ? "600" : "500",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.25s ease",
    background: isActive 
      ? (dark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)")
      : "transparent",
    color: isActive 
      ? (dark ? "#a5b4fc" : "#6366f1")
      : (dark ? "#cbd5e1" : "#64748b"),
    border: isActive 
      ? (dark ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(99,102,241,0.2)")
      : "1px solid transparent"
  });

  const mainContentStyle = {
    flex: 1,
    padding: "32px",
    marginLeft: "260px",
    background: dark ? "#0f172a" : "#f8fafc",
    color: dark ? "#e2e8f0" : "#1e293b",
    overflowY: "auto",
    minHeight: "100vh"
  };

  const headerBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    padding: "20px 24px",
    background: dark ? "rgba(30,41,59,0.6)" : "#ffffff",
    borderRadius: "16px",
    boxShadow: dark ? "0 4px 6px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
    backdropFilter: "blur(10px)",
    flexWrap: "wrap",
    gap: "16px"
  };

  const pageHeaderStyle = {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0",
    color: dark ? "#f1f5f9" : "#1e293b",
    letterSpacing: "-0.5px"
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  };

  const primaryButtonStyle = {
    padding: "10px 20px",
    background: dark ? "rgba(99,102,241,0.2)" : "#6366f1",
    color: dark ? "#a5b4fc" : "#ffffff",
    border: dark ? "1px solid rgba(99,102,241,0.3)" : "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
    boxShadow: dark ? "none" : "0 2px 4px rgba(99,102,241,0.2)"
  };

  const secondaryButtonStyle = {
    padding: "10px 20px",
    background: dark ? "rgba(51,65,85,0.6)" : "#ffffff",
    color: dark ? "#cbd5e1" : "#475569",
    border: dark ? "1px solid #334155" : "1px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease"
  };

  const cardStyle = {
    background: dark ? "rgba(30,41,59,0.6)" : "#ffffff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: dark ? "0 4px 6px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
    border: dark ? "1px solid #334155" : "1px solid #f1f5f9",
    transition: "all 0.3s ease"
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    background: dark ? "rgba(15,23,42,0.6)" : "#ffffff",
    color: dark ? "#e2e8f0" : "#1e293b",
    border: dark ? "1px solid #334155" : "1px solid #e2e8f0",
    borderRadius: "10px",
    outline: "none",
    marginBottom: "12px",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    boxSizing: "border-box"
  };

  const actionButtonStyle = {
    padding: "14px 24px",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
    width: "100%"
  };

  const statsCardStyle = {
    background: dark ? "rgba(30,41,59,0.6)" : "#ffffff",
    padding: "24px",
    borderRadius: "14px",
    minWidth: "160px",
    textAlign: "center",
    boxShadow: dark ? "0 4px 6px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
    border: dark ? "1px solid #334155" : "1px solid #f1f5f9",
    transition: "all 0.3s ease"
  };

  const statsCardTitleStyle = {
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 12px 0",
    color: dark ? "#94a3b8" : "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const statsCardValueStyle = {
    fontSize: "32px",
    fontWeight: "700",
    margin: "0",
    color: dark ? "#f1f5f9" : "#1e293b"
  };

  const taskItemStyle = (task) => {
  const isOverdue = task.dueDate && task.dueDate < today && !task.completed;
    
    return {
      background: dark ? "rgba(30,41,59,0.6)" : "#ffffff",
      padding: "16px 20px",
      marginBottom: "12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "12px",
      border: dark ? "1px solid #334155" : "1px solid #e2e8f0",
      borderLeft: task.priority === "High"
        ? "4px solid #ef4444"
        : task.priority === "Medium"
        ? "4px solid #f59e0b"
        : "4px solid #10b981",
      textDecoration: task.completed ? "line-through" : "none",
      opacity: task.completed ? 0.6 : 1,
      transition: "all 0.2s ease",
      boxShadow: isOverdue ? "0 0 0 2px rgba(239,68,68,0.2)" : "none",
      flexWrap: "wrap",
      gap: "12px"
    };
  };

  const filterButtonStyle = (isActive) => ({
    padding: "10px 20px",
    background: isActive 
      ? (dark ? "rgba(99,102,241,0.2)" : "#6366f1")
      : (dark ? "rgba(51,65,85,0.4)" : "#ffffff"),
    color: isActive 
      ? (dark ? "#a5b4fc" : "#ffffff")
      : (dark ? "#cbd5e1" : "#64748b"),
    border: isActive 
      ? (dark ? "1px solid rgba(99,102,241,0.3)" : "none")
      : (dark ? "1px solid #334155" : "1px solid #e2e8f0"),
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    marginRight: "8px",
    marginBottom: "8px",
    transition: "all 0.2s ease"
  });

  const priorityBadgeStyle = (priority) => {
    const colors = {
      High: { bg: dark ? "rgba(239,68,68,0.15)" : "#fee2e2", text: dark ? "#fca5a5" : "#dc2626" },
      Medium: { bg: dark ? "rgba(245,158,11,0.15)" : "#fef3c7", text: dark ? "#fcd34d" : "#d97706" },
      Low: { bg: dark ? "rgba(16,185,129,0.15)" : "#d1fae5", text: dark ? "#6ee7b7" : "#059669" }
    };
    
    const color = colors[priority] || colors.Low;
    
    return {
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      background: color.bg,
      color: color.text,
      marginLeft: "8px"
    };
  };

  const progressBarContainerStyle = {
    background: dark ? "rgba(51,65,85,0.4)" : "#e2e8f0",
    height: "12px",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "8px"
  };

  const progressBarFillStyle = {
    width: `${progress}%`,
    height: "12px",
    background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
    borderRadius: "8px",
    transition: "width 0.5s ease"
  };

  const calendarCardStyle = (task) => {
    const isOverdue = task.dueDate && task.dueDate < today && !task.completed;
    const isToday = task.dueDate === today;
    
    return {
      padding: "16px 20px",
      marginBottom: "12px",
      borderRadius: "12px",
      background: task.completed
        ? (dark ? "rgba(16,185,129,0.1)" : "#d1fae5")
        : isOverdue
        ? (dark ? "rgba(239,68,68,0.1)" : "#fee2e2")
        : isToday
        ? (dark ? "rgba(245,158,11,0.1)" : "#fef3c7")
        : (dark ? "rgba(51,65,85,0.4)" : "#f1f5f9"),
      border: dark ? "1px solid #334155" : "1px solid #e2e8f0",
      color: dark ? "#e2e8f0" : "#1e293b"
    };
  };

  const scheduleItemStyle = {
    background: dark ? "rgba(30,41,59,0.6)" : "#f8fafc",
    padding: "16px 20px",
    marginTop: "12px",
    borderRadius: "12px",
    border: dark ? "1px solid #334155" : "1px solid #e2e8f0"
  };

  const listItemStyle = {
    marginTop: "12px",
    background: dark ? "rgba(30,41,59,0.6)" : "#f8fafc",
    padding: "16px 20px",
    borderRadius: "12px",
    border: dark ? "1px solid #334155" : "1px solid #e2e8f0",
    color: dark ? "#e2e8f0" : "#1e293b",
    fontSize: "15px",
    lineHeight: "1.6"
  };

  // Progress Ring Calculation
  const progressPercent = Math.min((studyHours / dailyGoal) * 100, 100);
  const ringColor = progressPercent >= 100 ? "#22c55e" : "#8b5cf6";

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ 
          ...sidebarHeaderStyle, 
          textAlign: "center"
        }}>

          <img 
            src={logo}
            alt="Student Hub"
            style={{ 
              width: "210px", 
              height: "140px", 
              objectFit: "contain",
              transition: "transform 0.3s ease",
              filter: dark 
                ? "brightness(1.4) contrast(1.2) drop-shadow(0 0 6px rgba(255,255,255,0.4))"
                : "none"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
        </div>
        
        <div style={navContainerStyle}>
          <div 
            onClick={() => setPage("dashboard")} 
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(6px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0px)"}
            style={navItemStyle(page === "dashboard")}
          >
            <span style={{ fontSize: "18px" }}>📊</span>
            <span>Dashboard</span>
          </div>
          
          <div 
            onClick={() => setPage("tasks")} 
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(6px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0px)"}
            style={navItemStyle(page === "tasks")}
          >
            <span style={{ fontSize: "18px" }}>📋</span>
            <span>Tasks</span>
          </div>
          
          <div 
            onClick={() => setPage("calendar")} 
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(6px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0px)"}
            style={navItemStyle(page === "calendar")}
          >
            <span style={{ fontSize: "18px" }}>📅</span>
            <span>Calendar</span>
          </div>
          
          <div 
            onClick={() => setPage("analytics")} 
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(6px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0px)"}
            style={navItemStyle(page === "analytics")}
          >
            <span style={{ fontSize: "18px" }}>📈</span>
            <span>Analytics</span>
          </div>
          
          <div 
            onClick={() => setPage("study")}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(6px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0px)"}
            style={navItemStyle(page === "study")}
          >
            <span style={{ fontSize: "18px" }}>📚</span>
            <span>Study Tracker</span>
          </div>
          
          <div 
            onClick={() => setPage("schedule")} 
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(6px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0px)"}
            style={navItemStyle(page === "schedule")}
          >
            <span style={{ fontSize: "18px" }}>🗓</span>
            <span>Schedule</span>
          </div>
          
          <div 
            onClick={() => setPage("goals")} 
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(6px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0px)"}
            style={navItemStyle(page === "goals")}
          >
            <span style={{ fontSize: "18px" }}>🎯</span>
            <span>Goals</span>
          </div>
          
          <div 
            onClick={() => setPage("notes")} 
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(6px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0px)"}
            style={navItemStyle(page === "notes")}
          >
            <span style={{ fontSize: "18px" }}>📝</span>
            <span>Notes</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={headerBarStyle}>
          <h1 style={pageHeaderStyle}>
            {page === "tasks" && "My Tasks"}
            {page === "dashboard" && "Dashboard"}
            {page === "calendar" && "Calendar"}
            {page === "analytics" && "Analytics"}
            {page === "study" && "Study Tracker"}
            {page === "schedule" && "Class Schedule"}
            {page === "goals" && "My Goals"}
            {page === "notes" && "Quick Notes"}
          </h1>
          
          <div style={buttonGroupStyle}>
            <button onClick={() => setDark(!dark)} style={secondaryButtonStyle}>
              {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
              style={primaryButtonStyle}
            >
              Logout
            </button>
          </div>
        </div>

        {page === "tasks" && (
          <>
            <div style={cardStyle}>
              <h3 style={{ marginTop: "0", marginBottom: "20px", fontSize: "18px", fontWeight: "600", color: dark ? "#f1f5f9" : "#1e293b" }}>Add New Task</h3>
              
              <input
                style={inputStyle}
                type="text"
                placeholder="What do you need to do?"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "12px" }}>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={inputStyle}
                >
                  <option>Study</option>
                  <option>Work</option>
                  <option>Personal</option>
                  <option>Fitness</option>
                </select>

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={inputStyle}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={inputStyle}
              />

              <button style={actionButtonStyle} onClick={addTask}>Add Task</button>
            </div>

            <div style={{ marginTop: "24px" }}>
              <input
                style={inputStyle}
                type="text"
                placeholder="🔍 Search tasks..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <div style={{ ...cardStyle, marginTop: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ fontSize: "14px", fontWeight: "600", color: dark ? "#94a3b8" : "#64748b" }}>
                  📋 Total: <span style={{ color: dark ? "#f1f5f9" : "#1e293b" }}>{total}</span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: dark ? "#94a3b8" : "#64748b" }}>
                  ✅ Done: <span style={{ color: dark ? "#f1f5f9" : "#1e293b" }}>{completed}</span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: dark ? "#94a3b8" : "#64748b" }}>
                  ⏳ Pending: <span style={{ color: dark ? "#f1f5f9" : "#1e293b" }}>{pending}</span>
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: dark ? "#94a3b8" : "#64748b" }}>Progress</span>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: dark ? "#f1f5f9" : "#1e293b" }}>{progress}%</span>
                </div>
                <div style={progressBarContainerStyle}>
                  <div style={progressBarFillStyle}></div>
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <button onClick={() => setFilter("all")} style={filterButtonStyle(filter === "all")}>
                  All
                </button>
                <button onClick={() => setFilter("completed")} style={filterButtonStyle(filter === "completed")}>
                  Completed
                </button>
                <button onClick={() => setFilter("pending")} style={filterButtonStyle(filter === "pending")}>
                  Pending
                </button>
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              {tasks
                .filter(t => t.text.toLowerCase().includes(searchText.toLowerCase()))
                .filter(t => {
                  if (filter === "completed") return t.completed;
                  if (filter === "pending") return !t.completed;
                  return true;
                })
                .map((t, index) => (
                  <div key={t._id} style={taskItemStyle(t)}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      {editIndex === index ? (
                        <input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          style={{
                            ...inputStyle,
                            marginBottom: "0",
                            width: "100%"
                          }}
                        />
                      ) : (
                        <div onClick={() => toggleTask(t)} style={{ cursor: "pointer" }}>
                          <div style={{ fontSize: "15px", fontWeight: "500", marginBottom: "6px", color: dark ? "#e2e8f0" : "#1e293b" }}>
                            {t.text}
                          </div>
                          <div style={{ fontSize: "13px", color: dark ? "#94a3b8" : "#64748b", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px" }}>
                            <span>📂 {t.category}</span>
                            <span style={priorityBadgeStyle(smartPriority(t))}>
                              {smartPriority(t)} (AI)
                            </span>
                            {t.dueDate && (
                              <span style={{ marginLeft: "8px" }}>📅 {t.dueDate}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      {editIndex === index ? (
                        <button 
                          onClick={saveEdit}
                          style={{
                            padding: "8px 12px",
                            background: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px"
                          }}
                        >
                          💾
                        </button>
                      ) : (
                        <button 
                          onClick={() => startEdit(index)}
                          style={{
                            padding: "8px 12px",
                            background: dark ? "rgba(59,130,246,0.2)" : "#dbeafe",
                            color: dark ? "#93c5fd" : "#1e40af",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "14px"
                          }}
                        >
                          ✏️
                        </button>
                      )}
                      <button 
                        onClick={() => deleteTask(t._id)}
                        style={{
                          padding
                          : "8px 12px",
                          background: dark ? "rgba(239,68,68,0.2)" : "#fee2e2",
                          color: dark ? "#fca5a5" : "#dc2626",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "14px"
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {page === "dashboard" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
              <div style={statsCardStyle}>
                <h3 style={statsCardTitleStyle}>📋 Total Tasks</h3>
                <p style={statsCardValueStyle}>{total}</p>
              </div>

              <div style={statsCardStyle}>
                <h3 style={statsCardTitleStyle}>✅ Completed</h3>
                <p style={statsCardValueStyle}>{completed}</p>
              </div>

              <div style={statsCardStyle}>
                <h3 style={statsCardTitleStyle}>⏳ Pending</h3>
                <p style={statsCardValueStyle}>{pending}</p>
              </div>

              <div style={statsCardStyle}>
                <h3 style={statsCardTitleStyle}>📚 Study Hours</h3>
                <p style={statsCardValueStyle}>{studyHours}</p>
              </div>

              <div style={statsCardStyle}>
                <h3 style={statsCardTitleStyle}>🎯 Goals</h3>
                <p style={statsCardValueStyle}>{goals.length}</p>
              </div>

              <div style={statsCardStyle}>
                <h3 style={statsCardTitleStyle}>📝 Notes</h3>
                <p style={statsCardValueStyle}>{notes.length}</p>
              </div>

            </div>
            
              <div style={{ ...cardStyle, marginTop: "24px" }}>
                <h3 style={statsCardTitleStyle}>📈 Weekly Performance</h3>
                <WeeklyCharts tasks={tasks} />
              </div>

              <div style={{
                marginTop: "22px",
                padding: "18px 26px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #0f172a, #1e293b)",
                color: "#e0e7ff",
                fontStyle: "italic",
                position: "relative",
                boxShadow: "0 0 14px rgba(74,222,128,0.15)",
                borderLeft: "4px solid #4ade80",
                fontSize: "15px"
              }}>
                <b>Tip:</b> {productivityMessage()}
              </div>
          </div>
        )}

        {page === "calendar" && (
          <div>
            {tasks.length === 0 && (
              <div style={cardStyle}>
                <p style={{ textAlign: "center", color: dark ? "#94a3b8" : "#64748b", margin: "0" }}>No tasks yet</p>
              </div>
            )}

            {tasks
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map((t) => {
                const isOverdue = t.dueDate && t.dueDate < today && !t.completed;
                const isToday = t.dueDate === today;

                return (
                  <div key={t._id} style={calendarCardStyle(t)}>
                    <div style={{ fontWeight: "600", fontSize: "15px", marginBottom: "8px" }}>
                      {t.text}
                    </div>
                    <div style={{ fontSize: "14px", color: dark ? "#94a3b8" : "#64748b" }}>
                      📅 {t.dueDate || "No date"}
                    </div>
                    <div style={{ fontSize: "14px", color: dark ? "#94a3b8" : "#64748b" }}>
                      📂 {t.category}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {page === "analytics" && (
          <div style={cardStyle}>
            <h2 style={{ marginTop: "0", fontSize: "20px", fontWeight: "600", color: dark ? "#f1f5f9" : "#1e293b" }}>📊 Weekly Productivity</h2>
            <WeeklyCharts tasks={tasks} />
          </div>
        )}

        {page === "study" && (
          <div style={cardStyle}>
            <h2 style={{
              marginTop: "0",
              marginBottom: "24px",
              fontSize: "20px",
              fontWeight: "600",
              color: dark ? "#f1f5f9" : "#1e293b"
            }}>
              📚 Study Tracker
            </h2>

            {/* Progress Ring */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{
                fontSize: "14px",
                fontWeight: "600",
                color: dark ? "#94a3b8" : "#64748b",
                marginBottom: "12px"
              }}>
                Hours Studied Today
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  background: `conic-gradient(${ringColor} 0% ${progressPercent}%, #1e293b ${progressPercent}% 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(139,92,246,0.6)"
                }}>
                  <div style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "50%",
                    background: dark ? "#0f172a" : "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <div style={{ fontSize: "36px", fontWeight: "800", fontFamily: "monospace" }}>
                      {studyHours}
                    </div>
                    <div style={{ fontSize: "12px", color: dark ? "#94a3b8" : "#64748b" }}>
                      hrs
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: "12px", color: dark ? "#94a3b8" : "#64748b", marginTop: "10px" }}>
                  {studyHours}/{dailyGoal} hrs
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: "flex",
              gap: "18px",
              justifyContent: "center",
              marginBottom: "40px"
            }}>
              <button
                onClick={() => {
                  const now = new Date();
                  const newSession = {
                    hours: 1,
                    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  };
                  setSessions(prev => [newSession, ...prev]);
                  setStudyHours(prev => prev + 1);
                }}

                style={{ ...actionButtonStyle, width: "160px" }}
              >
                + Add 1 Hour
              </button>

              <button
                onClick={() => {
                  setStudyHours(0);
                  setSessions([]);
                }}
                style={{
                  width: "160px",
                  padding: "14px 24px",
                  background: "transparent",
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "15px"
                }}
              >
                Reset
              </button>
            </div>

            {/* Divider */}
            <div style={{
              height: "1px",
              background: dark ? "#334155" : "#e5e7eb",
              margin: "32px 0"
            }} />

            {/* Study Log */}
            <h4 style={{
              marginBottom: "12px",
              fontSize: "15px",
              fontWeight: "700",
              color: dark ? "#e2e8f0" : "#334155"
            }}>
              🕒 Today's Study Log
            </h4>

            <div style={{
              minHeight: "200px",
              background: dark ? "#1e293b" : "#f9fafb",
              padding: "20px",
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}>
              {sessions.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  fontSize: "14px",
                  color: dark ? "#94a3b8" : "#64748b"
                }}>
                  📄 No sessions yet — start your first one!
                </div>
              ) : (
                sessions.slice(0, 5).map((s, i) => (
                  <div key={i} style={{
                    marginTop: "8px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: dark ? "#0f172a" : "#ffffff",
                    fontSize: "13px"
                  }}>
                    ⏱ {s.hours} hr at {s.time}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {page === "schedule" && (
          <div>
            <div style={cardStyle}>
              <h3 style={{ marginTop: "0", marginBottom: "20px", fontSize: "18px", fontWeight: "600", color: dark ? "#f1f5f9" : "#1e293b" }}>Add Class Schedule</h3>

              <input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={inputStyle}
              />

              <select value={day} onChange={(e) => setDay(e.target.value)} style={inputStyle}>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
              </select>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <input 
                  type="time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)} 
                  style={inputStyle} 
                />
                <input 
                  type="time" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)} 
                  style={inputStyle} 
                />
              </div>

              <button onClick={addSchedule} style={actionButtonStyle}>Add Class</button>
            </div>

            <div style={{ marginTop: "24px" }}>
              {schedules.map(s => (
                <div key={s._id} style={scheduleItemStyle}>
                  <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "8px", color: dark ? "#f1f5f9" : "#1e293b" }}>
                    {s.subject}
                  </div>
                  <div style={{ fontSize: "14px", color: dark ? "#94a3b8" : "#64748b" }}>
                    {s.day} | {s.startTime} – {s.endTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === "goals" && (
          <div>
            <div style={cardStyle}>
              <h3 style={{ marginTop: "0", marginBottom: "20px", fontSize: "18px", fontWeight: "600", color: dark ? "#f1f5f9" : "#1e293b" }}>Add New Goal</h3>

              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Enter your goal"
                style={inputStyle}
              />

              <button onClick={addGoal} style={actionButtonStyle}>Add Goal</button>
            </div>

            <div style={{ marginTop: "24px" }}>
              {goals.map((g) => (
                <div key={g._id} style={listItemStyle}>
                  {g.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {page === "notes" && (
          <div>
            <div style={cardStyle}>
              <h3 style={{ marginTop: "0", marginBottom: "20px", fontSize: "18px", fontWeight: "600", color: dark ? "#f1f5f9" : "#1e293b" }}>Add New Note</h3>

              <textarea
                placeholder="Write your note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{
                  width: "100%",
                  height: "120px",
                  padding: "14px 16px",
                  fontSize: "15px",
                  background: dark ? "rgba(15,23,42,0.6)" : "#ffffff",
                  color: dark ? "#e2e8f0" : "#1e293b",
                  border: dark ? "1px solid #334155" : "1px solid #e2e8f0",
                  borderRadius: "10px",
                  outline: "none",
                  marginBottom: "12px",
                  fontFamily: "inherit",
                  resize: "vertical",
                  boxSizing: "border-box"
                }}
              />

              <button onClick={addNote} style={actionButtonStyle}>Add Note</button>
            </div>

            <div style={{ marginTop: "24px" }}>
              {notes.map((n) => (
                <div key={n._id} style={listItemStyle}>
                  {n.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;