import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./NotesPage.scss";

const NotesPage = ({ setIsConnected }) => { 
  const [list, setList] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [isEditingOrAdding, setIsEditingOrAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const response = await axios.get("https://notes.devlop.tech/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setList([]);
    }
  };

  const addNote = async () => {
    if (!newTitle || !newContent) {
      alert("Please provide both title and content.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const newNote = { title: newTitle, content: newContent };
      const response = await axios.post("https://notes.devlop.tech/api/notes", newNote, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList((prevList) => [response.data, ...prevList]);
      setNewTitle("");
      setNewContent("");
      setIsEditingOrAdding(false); 
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      await axios.delete(`https://notes.devlop.tech/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList((prevList) => prevList.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const startEditing = (note) => {
    setEditingNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
    setIsEditingOrAdding(true); 
  };

  const updateNote = async () => {
    if (!newTitle || !newContent) {
      alert("Please provide both title and content.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const updatedNote = { title: newTitle, content: newContent };
      await axios.put(
        `https://notes.devlop.tech/api/notes/${editingNote.id}`,
        updatedNote,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setList((prevList) =>
        prevList.map((note) =>
          note.id === editingNote.id ? { ...note, ...updatedNote } : note
        )
      );
      setEditingNote(null);
      setNewTitle("");
      setNewContent("");
      setIsEditingOrAdding(false);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsConnected(false);
    navigate("/"); 
  };

  return (
    <div className="list">
      <div className="top-buttons">
        {!isEditingOrAdding && (
          <button className="btn-add-note" onClick={() => setIsEditingOrAdding(true)}>
            Add Note
          </button>
        )}
        <button className="btn-logout" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <h2>All Notes</h2>

      {isEditingOrAdding && (
        <>
          {editingNote ? (
            <div className="edit-note-form">
              <h3>Edit Note</h3>
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <textarea
                placeholder="Content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              ></textarea>
              <button className="btn-save-edit" onClick={updateNote}>
                Save Changes
              </button>
              <button
                className="btn-cancel-edit"
                onClick={() => {
                  setEditingNote(null);
                  setIsEditingOrAdding(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="add-note-form">
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <textarea
                placeholder="Content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              ></textarea>
              <button className="btn-save-note" onClick={addNote}>
                Save Note
              </button>
              <button className="btn-cancel" onClick={() => setIsEditingOrAdding(false)}>
                Cancel
              </button>
            </div>
          )}
        </>
      )}

      {!isEditingOrAdding && (
        <div className="cards">
          {list && list.length > 0 ? (
            list.map((note) => (
              <div className="card" key={note.id}>
                <p className="card-title">
                  <strong>{note.title}</strong>
                </p>
                <p className="card-content">{note.content}</p>
                <div className="card-actions">
                  <button onClick={() => startEditing(note)}>Edit</button>
                  <button onClick={() => deleteNote(note.id)}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No notes available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
